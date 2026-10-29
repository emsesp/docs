#!/usr/bin/env node

/**
 * Fills in the missing translations in translations/locale_translations.h using DeepL.
 *
 * - The English text is the source. Every language slot that is empty (or missing at the
 *   end of the line) is translated.
 * - Generated translations get a "*" appended so they can be recognized as machine
 *   generated (and reviewed later). Existing translations are never touched.
 * - Like the translation editor, only entries in "// * <section>" blocks are processed.
 *   Entries following a plain comment (until the next "// * <section>") are skipped,
 *   unless --include-ignored is given.
 *
 * Usage:
 *   DEEPL_API_KEY=xxx node scripts/translate-locale.js [options]
 *
 * Options:
 *   --file <path>        locale file (default: translations/locale_translations.h)
 *   --locale <code>      only translate this language (e.g. de). Can be repeated.
 *   --include-ignored    also process entries the translation editor ignores
 *   --dry-run            show what would be translated, don't write the file
 */

const fs = require('fs');
const path = require('path');

const MARKER = '*';

// our language code -> DeepL target language code
const DEEPL_LANG = {
  de: 'DE',
  nl: 'NL',
  sv: 'SV',
  pl: 'PL',
  no: 'NB',
  fr: 'FR',
  tr: 'TR',
  it: 'IT',
  sk: 'SK',
  cs: 'CS',
  hu: 'HU',
};

const BATCH_SIZE = 50;
const DELAY_MS = 250;

// ---------------------------------------------------------------------------
// command line

const args = process.argv.slice(2);
const options = {
  file: path.join(__dirname, '..', 'translations', 'locale_translations.h'),
  locales: [],
  includeIgnored: false,
  dryRun: false,
};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--file' && args[i + 1]) {
    options.file = path.resolve(args[++i]);
  } else if (a === '--locale' && args[i + 1]) {
    options.locales.push(args[++i]);
  } else if (a === '--include-ignored') {
    options.includeIgnored = true;
  } else if (a === '--dry-run') {
    options.dryRun = true;
  } else {
    console.error(`Unknown option: ${a}`);
    process.exit(1);
  }
}

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY && !options.dryRun) {
  console.error('Error: DEEPL_API_KEY environment variable not set');
  console.error('Get your free API key at: https://www.deepl.com/pro-api');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// parsing of locale_translations.h (same rules as src/components/TranslationEditor/parser.js)

const ENTRY_START = /^(\s*)(\/\/\s*)?(MAKE_WORD_TRANSLATION|MAKE_TRANSLATION)\(/;
const LANG_DEFINE = /^\s*#define\s+EMSESP_LOCALE_([A-Za-z0-9_]+)\s+"([^"]+)"/;
const SECTION_LINE = /^\s*\/\/\s*\*\s+([^*\s].*?)\s*$/;
const PLAIN_COMMENT = /^\s*\/\/\s*\S/;
const UNESCAPE = {n: '\n', t: '\t', '"': '"', '\\': '\\'};

function readString(line, i) {
  let out = '';
  let j = i + 1;
  while (j < line.length) {
    const c = line[j];
    if (c === '\\') {
      const mapped = UNESCAPE[line[j + 1]];
      if (mapped === undefined) {
        return null;
      }
      out += mapped;
      j += 2;
    } else if (c === '"') {
      return {value: out, end: j + 1};
    } else {
      out += c;
      j++;
    }
  }
  return null;
}

function quote(s) {
  return (
    '"' +
    s
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') +
    '"'
  );
}

function parseEntry(line, languageCount) {
  const m = ENTRY_START.exec(line);
  if (!m || m[2]) {
    return null; // not an entry, or commented out
  }
  let i = m[0].length;
  const skipWs = () => {
    while (i < line.length && /\s/.test(line[i])) i++;
  };

  skipWs();
  const km = /^\w+/.exec(line.slice(i));
  if (!km) return null;
  const key = km[0];
  i += key.length;
  skipWs();
  if (line[i] !== ',') return null;
  i++;

  const strings = [];
  for (;;) {
    skipWs();
    if (line[i] !== '"') return null;
    const s = readString(line, i);
    if (!s) return null;
    strings.push(s.value);
    i = s.end;
    skipWs();
    if (line[i] === ',') {
      i++;
      continue;
    }
    if (line[i] === ')') {
      i++;
      break;
    }
    return null;
  }

  const word = m[3] === 'MAKE_WORD_TRANSLATION';
  const mqtt = word ? '' : strings[0];
  const values = word ? strings.slice() : strings.slice(1);
  const origCount = values.length;
  while (values.length < languageCount) values.push('');

  return {indent: m[1], macro: m[3], word, key, mqtt, values, origCount, tail: line.slice(i)};
}

function formatEntry(e) {
  let last = e.values.length - 1;
  while (last >= 0 && e.values[last] === '') last--;
  const count = Math.max(e.origCount, last + 1);
  const parts = [e.key];
  if (!e.word) parts.push(quote(e.mqtt));
  for (let i = 0; i < count; i++) parts.push(quote(e.values[i] ?? ''));
  return `${e.indent}${e.macro}(${parts.join(', ')})${e.tail}`;
}

// ---------------------------------------------------------------------------
// DeepL

const apiUrl = () =>
  DEEPL_API_KEY.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const unescapeXml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

// things that must not be translated: product name, printf style and {} / <> placeholders
const PROTECT = /EMS-ESP|%[-+ #0]*\d*(?:\.\d+)?[a-zA-Z]|\{[^}]*\}|<[^>]*>/g;

function protect(text) {
  let out = '';
  let last = 0;
  for (const m of text.matchAll(PROTECT)) {
    out += escapeXml(text.slice(last, m.index)) + '<x>' + escapeXml(m[0]) + '</x>';
    last = m.index + m[0].length;
  }
  return out + escapeXml(text.slice(last));
}

function unprotect(text) {
  return unescapeXml(text.replace(/<\/?x>/g, ''));
}

async function deeplTranslate(texts, lang) {
  const body = new URLSearchParams();
  for (const t of texts) body.append('text', protect(t));
  body.set('source_lang', 'EN');
  body.set('target_lang', DEEPL_LANG[lang]);
  body.set('tag_handling', 'xml');
  body.set('ignore_tags', 'x');
  body.set('context', 'Short labels, commands and descriptions of a heating system controller (EMS-ESP).');

  for (let attempt = 1; ; attempt++) {
    const res = await fetch(apiUrl(), {
      method: 'POST',
      headers: {Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded'},
      body,
    });
    if (res.ok) {
      const data = await res.json();
      return data.translations.map((t) => unprotect(t.text));
    }
    if ((res.status === 429 || res.status >= 500) && attempt < 5) {
      await sleep(1000 * attempt * attempt);
      continue;
    }
    throw new Error(`DeepL API error: ${res.status} - ${await res.text()}`);
  }
}

// ---------------------------------------------------------------------------
// main

async function main() {
  const text = fs.readFileSync(options.file, 'utf8');
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const lines = text.split(/\r?\n/);

  const languages = [];
  for (const l of lines) {
    const m = LANG_DEFINE.exec(l);
    if (m) languages.push(m[2]);
  }
  if (languages[0] !== 'en') {
    throw new Error(`First language must be "en", found "${languages[0]}"`);
  }

  const targets = languages
    .map((code, index) => ({code, index}))
    .filter((l) => l.index > 0 && (options.locales.length === 0 || options.locales.includes(l.code)));
  for (const t of targets) {
    if (!DEEPL_LANG[t.code]) throw new Error(`No DeepL language mapping for "${t.code}", add it to DEEPL_LANG`);
  }
  for (const code of options.locales) {
    if (!languages.includes(code)) throw new Error(`Unknown locale "${code}" (available: ${languages.join(', ')})`);
  }

  // find the entries with missing translations
  let ignoring = false;
  const work = []; // {lineNo, entry, missing: [language index]}
  lines.forEach((raw, lineNo) => {
    const entry = parseEntry(raw, languages.length);
    if (entry) {
      const english = entry.values[0];
      if ((ignoring && !options.includeIgnored) || !/\p{L}/u.test(english)) {
        return; // ignored block, or nothing to translate (e.g. "%", "°C", "1")
      }
      const missing = targets.filter((t) => entry.values[t.index] === '').map((t) => t.index);
      if (missing.length) work.push({lineNo, entry, missing});
      return;
    }
    if (SECTION_LINE.test(raw)) {
      ignoring = false;
    } else if (PLAIN_COMMENT.test(raw) && !ENTRY_START.test(raw)) {
      ignoring = true;
    }
  });

  const total = work.reduce((n, w) => n + w.missing.length, 0);
  console.log(`${work.length} entries with ${total} missing translations (${targets.map((t) => t.code).join(', ')})`);
  if (total === 0) return;

  let done = 0;
  let failed = 0;
  for (const t of targets) {
    const items = work.filter((w) => w.missing.includes(t.index));
    if (!items.length) continue;

    // translate each distinct English text only once
    const unique = [...new Set(items.map((w) => w.entry.values[0]))];
    const result = new Map();
    console.log(`\n${t.code}: translating ${unique.length} texts...`);

    if (options.dryRun) {
      unique.forEach((u) => console.log(`  [${t.code}] ${u}`));
      continue;
    }

    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
      const batch = unique.slice(i, i + BATCH_SIZE);
      try {
        const translated = await deeplTranslate(batch, t.code);
        batch.forEach((src, n) => result.set(src, translated[n]));
      } catch (err) {
        console.error(`  ${t.code}: ${err.message}`);
        failed += batch.length;
        if (/ 456 /.test(err.message) || / 403 /.test(err.message)) {
          throw err; // quota exceeded / bad key, no point in continuing
        }
      }
      await sleep(DELAY_MS);
    }

    for (const w of items) {
      const tr = result.get(w.entry.values[0]);
      if (tr && tr.trim() !== '') {
        w.entry.values[t.index] = tr.trim() + MARKER;
        w.changed = true;
        done++;
      }
    }
  }

  if (options.dryRun) {
    console.log('\nDry run, nothing written.');
    return;
  }

  // write back, only the changed lines
  for (const w of work) {
    if (w.changed) lines[w.lineNo] = formatEntry(w.entry);
  }
  fs.writeFileSync(options.file, lines.join(eol), 'utf8');
  console.log(`\nAdded ${done} translations (marked with "${MARKER}")${failed ? `, ${failed} failed` : ''}.`);
  console.log(`Updated ${options.file}`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
