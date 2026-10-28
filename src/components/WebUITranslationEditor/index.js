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
import {
  buildRows,
  parseI18nFile,
  placeholders,
  serializeI18nFile,
} from './parser'
import { createZip } from './zip'
import LanguageFlag from '../LanguageFlag'
// same look as the entity translation editor
import base from '../TranslationEditor/styles.module.css'
import extra from './styles.module.css'

const PAGE_SIZES = [50, 100, 250, 500]
const LANG_FILE = 'index.ts'
const LANG_DIR = /^[a-z]{2,3}([-_][A-Za-z0-9]+)?$/

// ---------------------------------------------------------------- state

function isEdited(row) {
  return Object.values(row.cells).some((c) => c && c.value !== c.orig)
}

function reducer(state, action) {
  switch (action.type) {
    case 'load':
      return action.table
    case 'edit': {
      const { index, lang, value } = action
      const old = state.rows[index]
      const row = {
        ...old,
        cells: { ...old.cells, [lang]: { ...old.cells[lang], value } },
      }
      row.edited = isEdited(row)
      const rows = state.rows.slice()
      rows[index] = row
      return { ...state, rows }
    }
    default:
      return state
  }
}

// ---------------------------------------------------------------- row

const Row = memo(function Row({ row, index, langs, dispatch }) {
  const enValue = row.cells.en?.value
  const enPlaceholders = enValue === undefined ? null : placeholders(enValue)
  return (
    <tr className={clsx(row.edited && base.rowEdited)}>
      <td className={clsx(base.stickyCol, base.keyCell)}>
        <div className={base.key}>{row.id}</div>
      </td>
      {langs.map((lang) => {
        const cell = row.cells[lang]
        if (!cell) {
          return (
            <td
              key={lang}
              className={extra.cellAbsent}
              title="This key is not in the file"
            >
              <span className={extra.absent}>not in file</span>
            </td>
          )
        }
        const changed = cell.value !== cell.orig
        const mismatch =
          lang !== 'en' &&
          enPlaceholders !== null &&
          cell.value !== '' &&
          placeholders(cell.value) !== enPlaceholders
        return (
          <td
            key={lang}
            className={clsx(
              changed && base.cellChanged,
              cell.value === '' && base.cellEmpty,
              mismatch && extra.cellWarn,
            )}
            title={
              mismatch
                ? `Placeholders differ from EN (${enPlaceholders || 'none'})`
                : undefined
            }
          >
            <textarea
              className={extra.input}
              rows={Math.max(1, Math.ceil(cell.value.length / 36))}
              value={cell.value}
              spellCheck={false}
              aria-label={`${row.id} ${lang}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              onChange={(e) =>
                dispatch({
                  type: 'edit',
                  index,
                  lang,
                  value: e.target.value.replace(/\r?\n/g, ' '),
                })
              }
            />
          </td>
        )
      })}
    </tr>
  )
})

// ---------------------------------------------------------------- helpers

async function readFileText(file) {
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  const bom = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
  const text = new TextDecoder('utf-8').decode(buf).replace(/^\uFEFF/, '')
  return { text, bom }
}

// finds <lang>/index.ts files in a directory handle, or in its "i18n" subfolder
async function scanDirectory(dir) {
  const found = {}
  const scan = async (d) => {
    for await (const [name, handle] of d.entries()) {
      if (handle.kind === 'directory' && LANG_DIR.test(name)) {
        try {
          const fh = await handle.getFileHandle(LANG_FILE)
          found[name] = { fileHandle: fh, file: await fh.getFile() }
        } catch {
          // not a language folder
        }
      }
    }
  }
  await scan(dir)
  if (Object.keys(found).length === 0) {
    try {
      await scan(await dir.getDirectoryHandle('i18n'))
    } catch {
      // no i18n subfolder
    }
  }
  return found
}

// same for the <input webkitdirectory> fallback
function scanFileList(fileList) {
  const found = {}
  for (const file of fileList) {
    const parts = (file.webkitRelativePath || '').split('/')
    if (parts.length >= 2 && parts[parts.length - 1] === LANG_FILE) {
      const lang = parts[parts.length - 2]
      if (LANG_DIR.test(lang)) {
        found[lang] = { fileHandle: null, file }
      }
    }
  }
  return found
}

async function loadFiles(found) {
  const files = {}
  for (const [lang, { fileHandle, file }] of Object.entries(found)) {
    const { text, bom } = await readFileText(file)
    files[lang] = { ...parseI18nFile(text), bom, fileHandle }
  }
  return files
}

// ---------------------------------------------------------------- component

export default function WebUITranslationEditor() {
  const [table, dispatch] = useReducer(reducer, null)
  const filesRef = useRef(null) // language -> parsed file (lines, eol, bom, fileHandle)
  const folderInput = useRef(null)
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)
  const [canWrite, setCanWrite] = useState(false) // directory is writable in place
  const [hasFSA, setHasFSA] = useState(false)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modifiedOnly, setModifiedOnly] = useState(false)
  const [pageSize, setPageSize] = useState(100)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setHasFSA('showDirectoryPicker' in window)
  }, [])

  const rows = table?.rows ?? []
  const langs = table?.langs ?? []

  const editedCount = useMemo(() => rows.filter((r) => r.edited).length, [rows])
  const dirty = editedCount > 0

  const missingPerLang = useMemo(
    () =>
      langs.map(
        (lang) =>
          rows.filter((r) => r.cells[lang] && r.cells[lang].value === '')
            .length,
      ),
    [langs, rows],
  )

  const placeholderIssues = useMemo(
    () =>
      rows.filter((r) => {
        const en = r.cells.en?.orig
        if (en === undefined) {
          return false
        }
        const p = placeholders(en)
        return langs.some(
          (l) =>
            l !== 'en' &&
            r.cells[l] &&
            r.cells[l].orig !== '' &&
            placeholders(r.cells[l].orig) !== p,
        )
      }).length,
    [langs, rows],
  )

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    const [mode, code] = statusFilter.split(':')
    return rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => {
        if (modifiedOnly) {
          return row.edited
        }
        // content filters look at the values as loaded so that rows don't
        // vanish while they are being edited
        if (!row.edited) {
          if (mode === 'missing') {
            const c = row.cells[code]
            if (!c || c.orig !== '') {
              return false
            }
          } else if (mode === 'same') {
            const c = row.cells[code]
            if (!c || c.orig === '' || c.orig !== row.cells.en?.orig) {
              return false
            }
          } else if (mode === 'placeholders') {
            const en = row.cells.en?.orig
            const p = en === undefined ? null : placeholders(en)
            if (
              p === null ||
              !langs.some(
                (l) =>
                  l !== 'en' &&
                  row.cells[l] &&
                  row.cells[l].orig !== '' &&
                  placeholders(row.cells[l].orig) !== p,
              )
            ) {
              return false
            }
          }
          if (needle) {
            const hay =
              row.id.toLowerCase() +
              '\n' +
              Object.values(row.cells)
                .map((c) => c.orig)
                .join('\n')
                .toLowerCase()
            if (!hay.includes(needle)) {
              return false
            }
          }
        }
        return true
      })
  }, [rows, langs, search, statusFilter, modifiedOnly])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visible = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  useEffect(() => {
    setPage(0)
  }, [search, statusFilter, modifiedOnly, pageSize])

  // ----- load

  const applyFiles = useCallback((files, writable, folderName) => {
    filesRef.current = files
    setCanWrite(writable)
    const built = buildRows(files)
    dispatch({ type: 'load', table: built })
    const warnings = []
    for (const lang of built.langs) {
      const absent = built.rows.filter((r) => !r.cells[lang]).length
      if (absent) {
        warnings.push(`${lang}: ${absent} key(s) missing from the file`)
      }
      if (files[lang].unparsed) {
        warnings.push(
          `${lang}: ${files[lang].unparsed} line(s) not understood (kept as-is)`,
        )
      }
    }
    setStatus({
      type: warnings.length ? 'warn' : 'info',
      text:
        `Loaded ${built.langs.length} languages (${built.langs.join(', ')}) and ${built.rows.length} keys` +
        (warnings.length ? ` Warning: ${warnings.join('; ')}.` : ''),
    })
  }, [])

  const confirmDiscard = useCallback(
    () =>
      !dirty ||
      window.confirm('You have unsaved changes. Open another folder anyway?'),
    [dirty],
  )

  const openFolder = useCallback(async () => {
    if (!confirmDiscard()) {
      return
    }
    if (!hasFSA) {
      folderInput.current?.click()
      return
    }
    setBusy(true)
    try {
      const dir = await window.showDirectoryPicker({ mode: 'readwrite' })
      const found = await scanDirectory(dir)
      if (Object.keys(found).length === 0) {
        throw new Error(
          `No <language>/${LANG_FILE} files found in "${dir.name}". Choose the i18n folder.`,
        )
      }
      applyFiles(await loadFiles(found), true, `"${dir.name}"`)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStatus({ type: 'error', text: err.message })
      }
    } finally {
      setBusy(false)
    }
  }, [applyFiles, confirmDiscard, hasFSA])

  const onFolderInput = useCallback(
    async (e) => {
      const list = Array.from(e.target.files || [])
      e.target.value = ''
      if (list.length === 0) {
        return
      }
      setBusy(true)
      try {
        const found = scanFileList(list)
        if (Object.keys(found).length === 0) {
          throw new Error(
            `No <language>/${LANG_FILE} files found in the chosen folder. Choose the i18n folder.`,
          )
        }
        const root = (list[0].webkitRelativePath || '').split('/')[0]
        applyFiles(await loadFiles(found), false, `"${root}"`)
      } catch (err) {
        setStatus({ type: 'error', text: err.message })
      } finally {
        setBusy(false)
      }
    },
    [applyFiles],
  )

  // ----- save

  const save = useCallback(async () => {
    const files = filesRef.current
    if (!files || !table) {
      return
    }
    setBusy(true)
    try {
      // collect the changed values per language
      const outputs = []
      for (const lang of table.langs) {
        const changes = new Map()
        for (const row of table.rows) {
          const c = row.cells[lang]
          if (c && c.value !== c.orig) {
            changes.set(row.id, c.value)
          }
        }
        if (changes.size > 0) {
          const f = files[lang]
          const text = serializeI18nFile(f, changes)
          outputs.push({
            lang,
            text,
            bom: f.bom,
            count: changes.size,
            fileHandle: f.fileHandle,
          })
        }
      }

      const encode = (o) => new Blob([(o.bom ? '\uFEFF' : '') + o.text])
      if (canWrite) {
        for (const o of outputs) {
          const w = await o.fileHandle.createWritable()
          await w.write(encode(o))
          await w.close()
        }
        setStatus({
          type: 'ok',
          text: `Saved ${outputs.length} file(s): ${outputs.map((o) => `${o.lang} (${o.count})`).join(', ')}.`,
        })
      } else {
        const enc = new TextEncoder()
        const zip = createZip(
          outputs.map((o) => ({
            name: `i18n/${o.lang}/${LANG_FILE}`,
            data: enc.encode((o.bom ? '\uFEFF' : '') + o.text),
          })),
        )
        const url = URL.createObjectURL(zip)
        const a = document.createElement('a')
        a.href = url
        a.download = 'i18n-translations.zip'
        document.body.appendChild(a)
        a.click()
        a.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        setStatus({
          type: 'ok',
          text: `Downloaded i18n-translations.zip with ${outputs.length} changed file(s) (${outputs.map((o) => o.lang).join(', ')}). Unzip it over your i18n folder's parent folder.`,
        })
      }

      // re-parse what we wrote so everything is "unmodified" again
      const fresh = { ...files }
      for (const o of outputs) {
        fresh[o.lang] = {
          ...parseI18nFile(o.text),
          bom: o.bom,
          fileHandle: o.fileHandle,
        }
      }
      filesRef.current = fresh
      dispatch({ type: 'load', table: buildRows(fresh) })
    } catch (err) {
      setStatus({ type: 'error', text: `Save failed: ${err.message}` })
    } finally {
      setBusy(false)
    }
  }, [table, canWrite])

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

  return (
    <div className={base.root}>
      <div className={base.toolbar}>
        <button
          className="button button--primary"
          onClick={openFolder}
          disabled={busy}
        >
          Open i18n folder…
        </button>
        {/* fallback for browsers without the File System Access API */}
        <input
          ref={folderInput}
          type="file"
          // eslint-disable-next-line react/no-unknown-property
          webkitdirectory=""
          multiple
          hidden
          onChange={onFolderInput}
        />
        <button
          className="button button--success"
          onClick={save}
          disabled={!table || !dirty || busy}
          title="Ctrl+S"
        >
          {canWrite ? 'Save' : 'Save (download zip)'}
          {dirty ? ` (${editedCount})` : ''}
        </button>
      </div>

      {status && (
        <div
          className={clsx(
            'alert',
            status.type === 'error' && 'alert--danger',
            status.type === 'warn' && 'alert--warning',
            status.type === 'ok' && 'alert--success',
            status.type === 'info' && 'alert--info',
          )}
        >
          {status.text}
        </div>
      )}

      {!table && (
        <div className={base.empty}>
          <p>
            Choose the WebUI <code>i18n</code> folder (
            <code>interface/src/i18n</code> in the EMS-ESP32 repository). Every{' '}
            <code>&lt;language&gt;/index.ts</code> file in it is read and shown
            side by side. Nothing is uploaded; the files are read and written
            entirely in your browser. You can download the i18n folder from
            &nbsp;
            <a
              href="https://github.com/emsesp/EMS-ESP32/tree/dev/interface/src/i18n"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://github.com/emsesp/EMS-ESP32/tree/dev/interface/src/i18n
            </a>
            &nbsp;and place it in your WebUI folder.
          </p>
          {!hasFSA && (
            <p>
              Your browser can't write to a folder directly (use Chrome, Edge or
              another Chromium-based browser for that). <b>Save</b> will
              download a zip with the changed files instead.
            </p>
          )}
        </div>
      )}

      {table && (
        <>
          <div className={base.filters}>
            <input
              className={base.search}
              type="search"
              placeholder="Search key or text…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              title="Filter by translation status"
            >
              <option value="">Any translation status</option>
              <optgroup label="Empty translation">
                {langs.map((l, i) => (
                  <option key={l} value={`missing:${l}`}>
                    Empty {l.toUpperCase()} ({missingPerLang[i]})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Identical to English (maybe not translated)">
                {langs
                  .filter((l) => l !== 'en')
                  .map((l) => (
                    <option key={l} value={`same:${l}`}>
                      Same as EN: {l.toUpperCase()}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Checks">
                <option value="placeholders:">
                  Placeholders differ from EN ({placeholderIssues})
                </option>
              </optgroup>
            </select>
            <label>
              <input
                type="checkbox"
                checked={modifiedOnly}
                onChange={(e) => setModifiedOnly(e.target.checked)}
              />{' '}
              Modified only
            </label>
          </div>

          <div className={base.summary}>
            {filtered.length} of {rows.length} keys
            {editedCount > 0 && <> &middot; {editedCount} modified</>}
            <span className={base.spacer} />
            <Pager
              page={safePage}
              pageCount={pageCount}
              onPage={setPage}
              pageSize={pageSize}
              onPageSize={setPageSize}
            />
          </div>

          <div className={base.tableWrap}>
            <table className={base.table}>
              <thead>
                <tr>
                  <th className={base.stickyCol}>Key</th>
                  {langs.map((l, i) => (
                    <th key={l}>
                      <LanguageFlag code={l} />
                      {missingPerLang[i] > 0 && (
                        <span
                          className={base.missingCount}
                          title={`${missingPerLang[i]} empty ${l} translations`}
                        >
                          {missingPerLang[i]}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(({ row, index }) => (
                  <Row
                    key={row.id}
                    row={row}
                    index={index}
                    langs={langs}
                    dispatch={dispatch}
                  />
                ))}
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={langs.length + 1}>
                      <div className={base.empty}>No matching keys.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={base.summary}>
            <span className={base.spacer} />
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
    <span className={base.pager}>
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
