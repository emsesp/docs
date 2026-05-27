import React, { useEffect, useState } from 'react'

const FALLBACK = {
  stable: { version: '3.8.1' },
  dev: { version: '3.9.0-dev' },
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function useLatestReleases() {
  const [versions, setVersions] = useState(FALLBACK)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('https://emsesp.org/versions.json', { cache: 'no-cache' })
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`)),
      )
      .then((data) => {
        if (cancelled) return
        setVersions({
          stable: data.stable || FALLBACK.stable,
          dev: data.dev || FALLBACK.dev,
        })
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const stable = versions.stable || {}
  const dev = versions.dev || {}
  return {
    stableVersion: stable.version || FALLBACK.stable.version,
    devVersion: dev.version || FALLBACK.dev.version,
    stableDate: formatDate(stable.date),
    devDate: formatDate(dev.date),
    loaded,
  }
}

export function StableVersion() {
  const { stableVersion, loaded } = useLatestReleases()
  return (
    <strong style={{ opacity: loaded ? 1 : 0.7, transition: 'opacity 0.2s' }}>
      v{stableVersion}
    </strong>
  )
}

export function DevVersion() {
  const { devVersion, loaded } = useLatestReleases()
  return (
    <strong style={{ opacity: loaded ? 1 : 0.7, transition: 'opacity 0.2s' }}>
      v{devVersion}
    </strong>
  )
}

export function FirmwareLink({ variant }) {
  const { stableVersion, loaded } = useLatestReleases()
  const underscored = stableVersion.replace(/\./g, '_')
  const fileName = `EMS-ESP-${underscored}-${variant}.bin`
  const url = `https://github.com/emsesp/EMS-ESP32/releases/download/v${stableVersion}/${fileName}`
  return (
    <a
      href={url}
      style={{ opacity: loaded ? 1 : 0.7, transition: 'opacity 0.2s' }}
    >
      {fileName}
    </a>
  )
}

export default function LatestReleases() {
  const { stableVersion, devVersion, stableDate, devDate, loaded } =
    useLatestReleases()

  return (
    <ul style={{ opacity: loaded ? 1 : 0.7, transition: 'opacity 0.2s' }}>
      <li>
        <strong>Stable:</strong>{' '}
        <a
          href={`https://github.com/emsesp/EMS-ESP32/releases/tag/v${stableVersion}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          v{stableVersion}
        </a>
        {stableDate && (
          <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>
            {' '}
            — {stableDate}
          </span>
        )}
      </li>
      <li>
        <strong>Development:</strong>{' '}
        <a
          href="https://github.com/emsesp/EMS-ESP32/releases/tag/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          v{devVersion}
        </a>
        {devDate && (
          <span style={{ color: 'var(--ifm-color-emphasis-600)' }}>
            {' '}
            — {devDate}
          </span>
        )}
      </li>
    </ul>
  )
}
