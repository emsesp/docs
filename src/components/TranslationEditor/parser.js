/**
 * Parser / serializer for EMS-ESP's locale_translations.h
 *
 * Supported lines:
 *   #define EMSESP_LOCALE_EN "en"                       -> defines the languages, in order
 *   MAKE_WORD_TRANSLATION(key, "en", "de", ...)         -> key + translations
 *   MAKE_TRANSLATION(key, "mqtt", "en", "de", ...)      -> key + mqtt name + translations
 *   // MAKE_TRANSLATION(...)                            -> commented-out entry (ignored, kept verbatim)
 *
 *   // * name                                           -> starts a section (used for the section filter)
 *   // any other comment                                -> entries after it are ignored (kept verbatim,
 *                                                          not shown) until the next "// * name"
 *
 * Everything else (license header, comments, blank lines) is kept verbatim.
 * Entries that were not edited are written back exactly as they were read, so
 * saving produces a minimal diff.
 */

const ENTRY_START = /^(\s*)(\/\/\s*)?(MAKE_WORD_TRANSLATION|MAKE_TRANSLATION)\(/;
const LANG_DEFINE = /^\s*#define\s+EMSESP_LOCALE_([A-Za-z0-9_]+)\s+"([^"]+)"/;
// sections are only marked with "// * <name>"; all other comments are ignored
// (a following "*" such as "// **** NOTE ****" is not a section)
const SECTION_LINE = /^\s*\/\/\s*\*\s+([^*\s].*?)\s*$/;
// any other comment with text in it
const PLAIN_COMMENT = /^\s*\/\/\s*\S/;

const UNESCAPE = {n: '\n', t: '\t', '"': '"', '\\': '\\'};

// reads a C string literal starting at line[i] === '"'. Returns null if it uses an unsupported escape
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

export function quote(s) {
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

function parseEntry(line, section, languageCount) {
  const m = ENTRY_START.exec(line);
  if (!m) {
    return null;
  }
  let i = m[0].length;
  const skipWs = () => {
    while (i < line.length && /\s/.test(line[i])) {
      i++;
    }
  };

  skipWs();
  const km = /^\w+/.exec(line.slice(i));
  if (!km) {
    return null;
  }
  const key = km[0];
  i += key.length;
  skipWs();
  if (line[i] !== ',') {
    return null;
  }
  i++;

  const strings = [];
  for (;;) {
    skipWs();
    if (line[i] !== '"') {
      return null;
    }
    const s = readString(line, i);
    if (!s) {
      return null;
    }
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
  while (values.length < languageCount) {
    values.push('');
  }

  return {
    kind: 'entry',
    raw: line,
    indent: m[1],
    prefix: m[2] || '',
    commented: !!m[2],
    macro: m[3],
    word,
    key,
    mqtt,
    values,
    origValues: values.slice(),
    origCount,
    tail: line.slice(i),
    section,
    edited: false,
  };
}

export function formatEntry(e) {
  let last = e.values.length - 1;
  while (last >= 0 && e.values[last] === '') {
    last--;
  }
  // never drop arguments that were in the original line, but extend if needed
  const count = Math.max(e.origCount, last + 1);
  const parts = [e.key];
  if (!e.word) {
    parts.push(quote(e.mqtt));
  }
  for (let i = 0; i < count; i++) {
    parts.push(quote(e.values[i] ?? ''));
  }
  return `${e.indent}${e.prefix}${e.macro}(${parts.join(', ')})${e.tail}`;
}

/**
 * @param {string} text file contents (without BOM)
 */
export function parseLocaleFile(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const rawLines = text.split(/\r?\n/);

  // first pass: language codes, in the order they are defined
  const languages = [];
  for (const l of rawLines) {
    const m = LANG_DEFINE.exec(l);
    if (m) {
      languages.push(m[2]);
    }
  }

  const lines = [];
  const sections = [];
  let section = '';
  let unparsed = 0;
  let ignoredEntries = 0;
  // a plain comment ("// text", not "// * name") starts a block that is
  // ignored until the next "// * name" section marker
  let ignoring = false;

  for (const raw of rawLines) {
    const entry = parseEntry(raw, section, languages.length);
    if (entry) {
      if (entry.commented) {
        // commented-out entries are left alone
        lines.push({kind: 'raw', raw});
      } else if (ignoring) {
        ignoredEntries++;
        lines.push({kind: 'raw', raw});
      } else {
        lines.push(entry);
      }
      continue;
    }
    if (/^\s*(\/\/\s*)?MAKE_(WORD_)?TRANSLATION\(/.test(raw)) {
      if (!ignoring) {
        unparsed++;
      }
    } else {
      const sm = SECTION_LINE.exec(raw);
      if (sm) {
        section = sm[1];
        ignoring = false;
        if (!sections.includes(section)) {
          sections.push(section);
        }
      } else if (PLAIN_COMMENT.test(raw)) {
        ignoring = true;
      }
    }
    lines.push({kind: 'raw', raw});
  }

  return {languages, lines, sections, eol, unparsed, ignoredEntries};
}

export function serializeLocaleFile(doc) {
  return doc.lines
    .map((l) => (l.kind === 'entry' && l.edited ? formatEntry(l) : l.raw))
    .join(doc.eol);
}
