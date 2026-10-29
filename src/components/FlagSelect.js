import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import LanguageFlag from './LanguageFlag'
import styles from './FlagSelect.module.css'

/**
 * Drop-down like a <select>, but the options can show a language flag
 * (native <option> elements cannot contain images).
 *
 * options: [{ value, label, code? }]  - `code` is the language code of the flag
 */
export default function FlagSelect({ value, onChange, options, title }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const root = useRef(null)

  const selected = options.findIndex((o) => o.value === value)

  // close when clicking outside
  useEffect(() => {
    if (!open) {
      return undefined
    }
    const onDown = (e) => {
      if (root.current && !root.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const choose = (i) => {
    onChange(options[i].value)
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const step = e.key === 'ArrowDown' ? 1 : -1
      if (!open) {
        setActive(selected)
        setOpen(true)
      } else {
        setActive((a) => Math.min(options.length - 1, Math.max(0, a + step)))
      }
    } else if ((e.key === 'Enter' || e.key === ' ') && open && active >= 0) {
      e.preventDefault()
      choose(active)
    }
  }

  const renderOption = (o) =>
    o.code ? (
      <LanguageFlag code={o.code} label={o.label} />
    ) : (
      <span>{o.label}</span>
    )

  return (
    <div className={styles.root} ref={root} onKeyDown={onKeyDown}>
      <button
        type="button"
        className={styles.button}
        title={title}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setActive(selected)
          setOpen(!open)
        }}
      >
        {selected >= 0 && renderOption(options[selected])}
        <span className={styles.arrow} aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <ul className={styles.menu} role="listbox">
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={i === selected}
              className={clsx(
                styles.option,
                i === selected && styles.selected,
                i === active && styles.active,
              )}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
            >
              {renderOption(o)}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
