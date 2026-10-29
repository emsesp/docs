import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { parseLocaleFile, serializeLocaleFile } from './parser'
import LanguageFlag from '../LanguageFlag'
import FlagSelect from '../FlagSelect'
import styles from './styles.module.css'

const PAGE_SIZES = [50, 100, 250, 500]

// ---------------------------------------------------------------- state

function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return action.doc
    case 'edit': {
      const { index, col, field, value } = action
      const old = state.lines[index]
      const entry = { ...old }
      if (field === 'mqtt') {
        entry.mqtt = value
      } else {
        entry.values = old.values.slice()
        entry.values[col] = value
      }
      entry.edited = entry.values.some((v, i) => v !== entry.origValues[i])
      const lines = state.lines.slice()
      lines[index] = entry
      return { ...state, lines }
    }
    default:
      return state
  }
}

// ---------------------------------------------------------------- row

const Row = memo(function Row({ entry, index, languages, columns, dispatch }) {
  return (
    <tr className={clsx(entry.edited && styles.rowEdited)}>
      <td className={clsx(styles.stickyCol, styles.keyCell)}>
        <div className={styles.key}>{entry.key}</div>
        <div className={styles.meta}>
          {entry.word ? 'word' : `mqtt: ${entry.mqtt}`}
        </div>
      </td>
      {columns.map((col) => {
        const code = languages[col]
        const value = entry.values[col] ?? ''
        const changed = value !== entry.origValues[col]
        return (
          <td
            key={code}
            className={clsx(
              col === 0 && styles.stickyCol2,
              changed && styles.cellChanged,
              value === '' && styles.cellEmpty,
            )}
          >
            <input
              className={styles.input}
              type="text"
              value={value}
              spellCheck={false}
              aria-label={`${entry.key} ${code}`}
              onChange={(e) =>
                dispatch({ type: 'edit', index, col, value: e.target.value })
              }
            />
          </td>
        )
      })}
    </tr>
  )
})

// ---------------------------------------------------------------- helpers

async function pickFileWithHandle() {
  const [handle] = await window.showOpenFilePicker({
    multiple: false,
    mode: 'readwrite',
    types: [
      {
        description: 'C/C++ header',
        accept: { 'text/plain': ['.h', '.hpp'] },
      },
    ],
  })
  return handle
}

async function readFile(file) {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
  const text = new TextDecoder('utf-8').decode(buf).replace(/^\uFEFF/, '')
  return { text, bom }
}

function buildDoc(text, bom, fileName) {
  const doc = parseLocaleFile(text)
  return { ...doc, bom, fileName }
}

// ---------------------------------------------------------------- component

export default function TranslationEditor() {
  const [doc, dispatch] = useReducer(reducer, null)
  const fileHandle = useRef(null)
  const fileInput = useRef(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  // filters
  const [search, setSearch] = useState('')
  const [section, setSection] = useState('')
  const [missingLang, setMissingLang] = useState('')
  const [showLang, setShowLang] = useState('')
  const [modifiedOnly, setModifiedOnly] = useState(false)
  const [pageSize, setPageSize] = useState(100)
  const [page, setPage] = useState(0)

  // File System Access API (Chromium) lets us write straight back to the file.
  // Detected after mount so server-rendered and client markup match.
  const [hasFSA, setHasFSA] = useState(false)
  useEffect(() => {
    setHasFSA('showOpenFilePicker' in window)
  }, [])

  // ----- derived data

  const entries = useMemo(() => {
    if (!doc) {
      return []
    }
    const list = []
    doc.lines.forEach((l, index) => {
      if (l.kind === 'entry') {
        list.push({ entry: l, index })
      }
    })
    return list
  }, [doc])

  const editedCount = useMemo(
    () => entries.filter((e) => e.entry.edited).length,
    [entries],
  )
  const dirty = editedCount > 0

  const missingPerLang = useMemo(() => {
    if (!doc) {
      return []
    }
    return doc.languages.map(
      (_, col) =>
        entries.filter((e) => (e.entry.values[col] ?? '') === '').length,
    )
  }, [doc, entries])

  // columns (language indexes) to show: all, or EN (kept as reference) plus the chosen language
  const columns = useMemo(() => {
    if (!doc) {
      return []
    }
    const all = doc.languages.map((_, i) => i)
    const only = showLang ? doc.languages.indexOf(showLang) : -1
    return only < 0 ? all : [...new Set([0, only])]
  }, [doc, showLang])

  const filtered = useMemo(() => {
    if (!doc) {
      return []
    }
    const needle = search.trim().toLowerCase()
    const langCol = missingLang ? doc.languages.indexOf(missingLang) : -1
    return entries.filter(({ entry }) => {
      if (modifiedOnly) {
        return entry.edited
      }
      if (section && entry.section !== section) {
        return false
      }
      // content filters use the values as loaded, so rows don't jump
      // around or vanish while they're being edited
      if (langCol >= 0 && !entry.edited && entry.origValues[langCol] !== '') {
        return false
      }
      if (needle) {
        const hay =
          entry.key.toLowerCase() +
          '\n' +
          entry.mqtt.toLowerCase() +
          '\n' +
          entry.origValues.join('\n').toLowerCase()
        if (!hay.includes(needle) && !entry.edited) {
          return false
        }
      }
      return true
    })
  }, [doc, entries, search, section, missingLang, modifiedOnly])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  useEffect(() => {
    setPage(0)
  }, [search, section, missingLang, modifiedOnly, pageSize])

  // ----- load / save

  const loadFromFile = useCallback(async (file, handle) => {
    setBusy(true)
    try {
      const { text, bom } = await readFile(file)
      const loaded = buildDoc(text, bom, file.name)
      if (loaded.languages.length === 0) {
        throw new Error(
          'No "#define EMSESP_LOCALE_xx" language definitions found - is this locale_translations.h?',
        )
      }
      fileHandle.current = handle || null
      dispatch({ type: 'load', doc: loaded })
      const n = loaded.lines.filter((l) => l.kind === 'entry').length
      setStatus({
        type: 'info',
        text:
          `Loaded ${n} entries, languages ${loaded.languages.join(', ')}` +
          (loaded.unparsed
            ? `. WARNING: ${loaded.unparsed} translation line(s) could not be parsed and will be kept as-is.`
            : ''),
      })
    } catch (err) {
      setStatus({ type: 'error', text: `Could not open file: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }, [])

  const confirmDiscard = useCallback(
    () =>
      !dirty ||
      window.confirm('You have unsaved changes. Open another file anyway?'),
    [dirty],
  )

  const openFile = useCallback(async () => {
    if (!confirmDiscard()) {
      return
    }
    if (hasFSA) {
      try {
        const handle = await pickFileWithHandle()
        await loadFromFile(await handle.getFile(), handle)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setStatus({ type: 'error', text: err.message })
        }
      }
    } else {
      fileInput.current?.click()
    }
  }, [confirmDiscard, hasFSA, loadFromFile])

  const downloadFile = useCallback((blob, name) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }, [])

  const save = useCallback(async () => {
    if (!doc) {
      return
    }
    setBusy(true)
    try {
      const text = serializeLocaleFile(doc)
      const blob = new Blob([(doc.bom ? '\uFEFF' : '') + text], {
        type: 'text/plain;charset=utf-8',
      })
      const name = doc.fileName || 'locale_translations.h'
      if (fileHandle.current) {
        const writable = await fileHandle.current.createWritable()
        await writable.write(blob)
        await writable.close()
        setStatus({
          type: 'ok',
          text: `Saved ${editedCount} changed entr${editedCount === 1 ? 'y' : 'ies'} to ${name}.`,
        })
      } else {
        downloadFile(blob, name)
        setStatus({
          type: 'ok',
          text: `Downloaded ${name} with ${editedCount} changed entr${editedCount === 1 ? 'y' : 'ies'}. Copy it over the original file.`,
        })
      }
      // re-parse what we wrote so the "modified" markers reset
      dispatch({ type: 'load', doc: buildDoc(text, doc.bom, name) })
    } catch (err) {
      setStatus({ type: 'error', text: `Save failed: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }, [doc, editedCount, downloadFile])

  // Ctrl/Cmd+S
  const saveRef = useRef(save)
  saveRef.current = save
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (dirtyRef.current) {
          saveRef.current()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) {
      return undefined
    }
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  // ----- render

  const toolbarTop = (
    <div className={styles.toolbar}>
      <button
        className="button button--primary"
        onClick={openFile}
        disabled={busy}
      >
        Open file…
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".h,.hpp,text/plain"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          e.target.value = ''
          if (f) {
            loadFromFile(f, null)
          }
        }}
      />
      <button
        className="button button--success"
        onClick={save}
        disabled={!doc || !dirty || busy}
        title="Ctrl+S"
      >
        {fileHandle.current ? 'Save' : 'Save (download)'}
        {dirty ? ` (${editedCount})` : ''}
      </button>
      {doc && (
        <span className={styles.fileName}>
          {doc.fileName}
          {dirty && ' *'}
        </span>
      )}
    </div>
  )

  return (
    <div className={styles.root}>
      {toolbarTop}

      {status && (
        <div
          className={clsx(
            'alert',
            styles.status,
            status.type === 'error' && 'alert--danger',
            status.type === 'ok' && 'alert--success',
            status.type === 'info' && 'alert--info',
          )}
        >
          {status.text}
        </div>
      )}

      {!doc && (
        <div className={styles.empty}>
          <p>
            Open your <code>locale_translations.h</code> file to edit the entity
            translations in a table. Nothing is uploaded; the file is read and
            written entirely in your browser. The master file is located in
            &nbsp;
            <a
              href="https://github.com/emsesp/EMS-ESP32/blob/dev/src/core/locale_translations.h"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/emsesp/EMS-ESP32/blob/dev/src/core/locale_translations.h
            </a>
          </p>
          {!hasFSA && (
            <p>
              Your browser can't write to files directly (use Chrome, Edge or
              another Chromium-based browser for that). <b>Save</b> will
              download the updated file instead.
            </p>
          )}
        </div>
      )}

      {doc && (
        <>
          <div className={styles.filters}>
            <input
              className={styles.search}
              type="search"
              placeholder="Search id, mqtt name or text…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              title="Section in the file"
            >
              <option value="">All sections</option>
              {doc.sections.map((s) => (
                <option key={s} value={s}>
                  {s.length > 60 ? s.slice(0, 60) + '…' : s}
                </option>
              ))}
            </select>
            <FlagSelect
              value={missingLang}
              onChange={setMissingLang}
              title="Only show entries without a translation for a language"
              options={[
                { value: '', label: 'Any translation status' },
                ...doc.languages.map((code, i) => ({
                  value: code,
                  code,
                  label: `Missing ${code.toUpperCase()} (${missingPerLang[i]})`,
                })),
              ]}
            />
            <FlagSelect
              value={showLang}
              onChange={setShowLang}
              title="Choose which language column to show (EN is always shown as the reference)"
              options={[
                { value: '', label: 'All languages' },
                ...doc.languages.map((code) => ({
                  value: code,
                  code,
                  label: `Only ${code.toUpperCase()}`,
                })),
              ]}
            />
            <label>
              <input
                type="checkbox"
                checked={modifiedOnly}
                onChange={(e) => setModifiedOnly(e.target.checked)}
              />{' '}
              Modified only
            </label>
          </div>

          <div className={styles.summary}>
            {filtered.length} of {entries.length} entries
            {editedCount > 0 && <> &middot; {editedCount} modified</>}
            <span className={styles.spacer} />
            <Pager
              page={safePage}
              pageCount={pageCount}
              onPage={setPage}
              pageSize={pageSize}
              onPageSize={setPageSize}
            />
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.stickyCol}>ID</th>
                  {columns.map((i) => {
                    const code = doc.languages[i]
                    return (
                      <th
                        key={code}
                        className={clsx(i === 0 && styles.stickyCol2)}
                      >
                        <LanguageFlag code={code} />
                        {missingPerLang[i] > 0 && (
                          <span
                            className={styles.missingCount}
                            title={`${missingPerLang[i]} entries have no ${code} translation`}
                          >
                            {missingPerLang[i]}
                          </span>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {visible.map(({ entry, index }) => (
                  <Row
                    key={index}
                    entry={entry}
                    index={index}
                    languages={doc.languages}
                    columns={columns}
                    dispatch={dispatch}
                  />
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={columns.length + 1}>
                      <div className={styles.empty}>No matching entries.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.summary}>
            <span className={styles.spacer} />
            <Pager
              page={safePage}
              pageCount={pageCount}
              onPage={setPage}
              pageSize={pageSize}
              onPageSize={setPageSize}
            />
          </div>
        </>
      )}
    </div>
  )
}

function Pager({ page, pageCount, onPage, pageSize, onPageSize }) {
  return (
    <span className={styles.pager}>
      <select
        value={pageSize}
        onChange={(e) => onPageSize(Number(e.target.value))}
        title="Rows per page"
      >
        {PAGE_SIZES.map((n) => (
          <option key={n} value={n}>
            {n} / page
          </option>
        ))}
      </select>
      <button
        className="button button--sm button--secondary"
        disabled={page <= 0}
        onClick={() => onPage(page - 1)}
      >
        ‹ Prev
      </button>
      <span>
        {page + 1} / {pageCount}
      </span>
      <button
        className="button button--sm button--secondary"
        disabled={page >= pageCount - 1}
        onClick={() => onPage(page + 1)}
      >
        Next ›
      </button>
    </span>
  )
}
