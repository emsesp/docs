/**
 * Parser / serializer for the EMS-ESP WebUI translation files
 * (interface/src/i18n/<lang>/index.ts), which look like:
 *
 *   const en: Translation = {
 *     KEY: 'text',
 *     OTHER: "text with 'quotes'",
 *     LIST: [
 *       'item one',
 *       'item two'
 *     ],
 *   };
 *
 * Every translatable string becomes an "entry"; items of a list get the id
 * LIST[0], LIST[1], ... Everything else is kept verbatim, and entries that were
 * not edited are written back exactly as they were read.
 */

const KEY_PREFIX = /^(\s*)([A-Za-z0-9_$]+)(\s*:\s*)/;
const ARRAY_START = /^\s*([A-Za-z0-9_$]+)\s*:\s*\[\s*$/;
const ARRAY_END = /^\s*\]\s*,?\s*$/;
const TAIL = /^\s*,?\s*(\/\/.*)?$/;

const UNESCAPE = {n: '\n', t: '\t', '\\': '\\', "'": "'", '"': '"'};

// reads a quoted string starting at s[i] (a ' or " character).
// Returns null for unsupported escapes or an unterminated string
function readString(s, i) {
  const q = s[i];
  let out = '';
  let j = i + 1;
  while (j < s.length) {
    const c = s[j];
    if (c === '\\') {
      const mapped = UNESCAPE[s[j + 1]];
      if (mapped === undefined) {
        return null;
      }
      out += mapped;
      j += 2;
    } else if (c === q) {
      return {value: out, end: j + 1, quote: q};
    } else {
      out += c;
      j++;
    }
  }
  return null;
}

export function quote(value, q) {
  let s = value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
  s = s.split(q).join('\\' + q);
  return q + s + q;
}

// the part of the line that holds the string: `    KEY: 'text',`
function parseStringLine(line, inArrayKey, arrayIndex) {
  let head = '';
  let id;
  let i = 0;
  if (inArrayKey) {
    const ws = /^\s*/.exec(line)[0];
    head = ws;
    i = ws.length;
    id = `${inArrayKey}[${arrayIndex}]`;
  } else {
    const m = KEY_PREFIX.exec(line);
    if (!m) {
      return null;
    }
    head = m[0];
    i = head.length;
    id = m[2];
  }
  if (line[i] !== "'" && line[i] !== '"') {
    return null;
  }
  const s = readString(line, i);
  if (!s) {
    return null;
  }
  const tail = line.slice(s.end);
  if (!TAIL.test(tail)) {
    return null;
  }
  return {
    kind: 'entry',
    raw: line,
    id,
    head,
    quote: s.quote,
    value: s.value,
    tail,
  };
}

export function formatEntry(entry, value) {
  return `${entry.head}${quote(value, entry.quote)}${entry.tail}`;
}

/**
 * @param {string} text file contents (without BOM)
 * @returns {{lines: object[], eol: string, unparsed: number}}
 */
export function parseI18nFile(text) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const rawLines = text.split(/\r?\n/);
  const lines = [];
  let arrayKey = null;
  let arrayIndex = 0;
  let unparsed = 0;

  for (const raw of rawLines) {
    if (arrayKey) {
      if (ARRAY_END.test(raw)) {
        arrayKey = null;
        lines.push({kind: 'raw', raw});
        continue;
      }
      const e = parseStringLine(raw, arrayKey, arrayIndex);
      if (e) {
        arrayIndex++;
        lines.push(e);
      } else {
        if (raw.trim()) {
          unparsed++;
        }
        lines.push({kind: 'raw', raw});
      }
      continue;
    }

    const am = ARRAY_START.exec(raw);
    if (am) {
      arrayKey = am[1];
      arrayIndex = 0;
      lines.push({kind: 'raw', raw});
      continue;
    }

    const e = parseStringLine(raw, null, 0);
    if (e) {
      lines.push(e);
    } else {
      // a "KEY: <something we don't understand>" line is reported
      if (KEY_PREFIX.test(raw) && !/[{}]\s*,?\s*$/.test(raw)) {
        unparsed++;
      }
      lines.push({kind: 'raw', raw});
    }
  }

  return {lines, eol, unparsed};
}

/**
 * @param {{lines: object[], eol: string}} file
 * @param {Map<string,string>} changes  entry id -> new value
 */
export function serializeI18nFile(file, changes) {
  return file.lines
    .map((l) =>
      l.kind === 'entry' && changes.has(l.id)
        ? formatEntry(l, changes.get(l.id))
        : l.raw,
    )
    .join(file.eol);
}

// {0}, {num}, {name} ... (not the {{plural|forms}} syntax)
const PLACEHOLDER = /(?<!\{)\{[A-Za-z0-9_]+\}(?!\})/g;

export function placeholders(s) {
  return (s.match(PLACEHOLDER) || []).sort().join(' ');
}

// preferred column order (same order as the entity translations); anything
// else follows alphabetically
const LANGUAGE_ORDER = ['en', 'de', 'nl', 'sv', 'pl', 'no', 'fr', 'tr', 'it', 'sk', 'cs'];

export function sortLanguages(codes) {
  const rank = (c) => {
    const i = LANGUAGE_ORDER.indexOf(c);
    return i === -1 ? LANGUAGE_ORDER.length : i;
  };
  return [...codes].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
}

/**
 * Builds the table from the parsed files.
 * @param {Record<string, {lines: object[]}>} files  language code -> parsed file
 */
export function buildRows(files) {
  const langs = sortLanguages(Object.keys(files));
  // row order: follow the first language that has the key, base language first
  const ids = [];
  const seen = new Set();
  for (const lang of langs) {
    for (const l of files[lang].lines) {
      if (l.kind === 'entry' && !seen.has(l.id)) {
        seen.add(l.id);
        ids.push(l.id);
      }
    }
  }
  const rows = ids.map((id) => ({id, cells: {}, edited: false}));
  const byId = new Map(rows.map((r) => [r.id, r]));
  for (const lang of langs) {
    for (const l of files[lang].lines) {
      if (l.kind === 'entry') {
        byId.get(l.id).cells[lang] = {value: l.value, orig: l.value};
      }
    }
  }
  return {langs, rows};
}
