import React, { useState, useEffect } from 'react'
import styles from './TelegramTable.module.css'

export default function TelegramSearchAll() {
  const [allTelegrams, setAllTelegrams] = useState([])
  const [metadata, setMetadata] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedTelegram, setExpandedTelegram] = useState(null)

  const csvFiles = [
    'basic_telegrams.csv',
    'system_telegrams.csv',
    'error_status_telegrams.csv',
    'thermostat_telegrams.csv',
    'hybrid_module_telegrams.csv',
  ]

  useEffect(() => {
    // Load all CSV files and metadata
    Promise.all([
      ...csvFiles.map((file) =>
        fetch(`/data/${file}`).then((res) => res.text()),
      ),
      fetch('/data/telegram_metadata.json').then((res) => res.json()),
    ])
      .then((results) => {
        const metadataJson = results[results.length - 1]
        const csvDataArray = results.slice(0, -1)
        const allParsed = []

        csvDataArray.forEach((csvData, fileIndex) => {
          const rows = csvData.trim().split('\n')

          const parsed = rows.slice(1).map((row, index) => {
            // Handle CSV with quoted fields containing commas
            const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/
            const values = row
              .split(regex)
              .map((v) => v.replace(/^"|"$/g, '').trim())

            return {
              id: `${fileIndex}-${index}`,
              telegramId: values[0] || '',
              offset: values[1] || '',
              variableName: values[2] || '',
              min: values[3] || '',
              max: values[4] || '',
              resolution: values[5] || '',
              unit: values[6] || '',
              comment: values[7] || '',
            }
          })

          allParsed.push(...parsed)
        })

        setAllTelegrams(allParsed)
        setMetadata(metadataJson)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredTelegrams = allTelegrams.filter((telegram) => {
    if (!searchTerm) return false // Only show results when searching

    const meta = metadata[telegram.telegramId]

    return (
      telegram.variableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.telegramId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.offset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meta &&
        (meta.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meta.usedIn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meta.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meta.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meta.emsCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meta.distribution?.toLowerCase().includes(searchTerm.toLowerCase())))
    )
  })

  // Group telegrams by telegram ID for display
  const groupedTelegrams = filteredTelegrams.reduce((acc, telegram) => {
    if (!acc[telegram.telegramId]) {
      acc[telegram.telegramId] = []
    }
    acc[telegram.telegramId].push(telegram)
    return acc
  }, {})

  const toggleTelegram = (telegramId) => {
    setExpandedTelegram(expandedTelegram === telegramId ? null : telegramId)
  }

  if (loading) {
    return <div className={styles.loading}>Loading telegram database...</div>
  }

  if (error) {
    return (
      <div className={styles.error}>Error loading telegram data: {error}</div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.globalSearchBox}>
        <h3>🔍 Search all Telegrams</h3>
        <p className={styles.searchDescription}>
          Search across all 1,100+ telegram data entries from 250+ unique telegrams by variable
          name, telegram ID, offset, comment, description, device type, or any other field.
        </p>
        <input
          type="text"
          placeholder="Start typing to search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {searchTerm && (
        <div className={styles.stats}>
          Found {filteredTelegrams.length} matching entries in{' '}
          {Object.keys(groupedTelegrams).length} telegram(s)
        </div>
      )}

      {searchTerm && Object.keys(groupedTelegrams).length === 0 && (
        <div className={styles.noResults}>
          No telegram entries found matching "{searchTerm}".
        </div>
      )}

      {Object.keys(groupedTelegrams)
        .sort()
        .map((telegramId) => {
          const meta = metadata[telegramId]
          const telegramEntries = groupedTelegrams[telegramId]
          const isExpanded = expandedTelegram === telegramId

          return (
            <div key={telegramId} className={styles.telegramSection}>
              <div
                className={styles.telegramHeader}
                onClick={() => toggleTelegram(telegramId)}
              >
                <h3>Telegram: {telegramId}</h3>
                <span className={styles.expandIcon}>
                  {isExpanded ? '▼' : '▶'}
                </span>
              </div>

              {isExpanded && (
                <>
                  {meta && (
                    <div
                      className={`${styles.metadataBox} ${styles[meta.type]}`}
                    >
                      <div className={styles.metadataTitle}>{meta.name}</div>
                      <div className={styles.metadataContent}>
                        <p>
                          <strong>Used in:</strong> {meta.usedIn}
                        </p>
                        <p>
                          <strong>Description:</strong> {meta.description}
                        </p>
                        <p>
                          <strong>Class:</strong> {meta.class}
                        </p>
                        <p>
                          <strong>EMS category:</strong> {meta.emsCategory}
                        </p>
                        {meta.distribution && (
                          <p>
                            <strong>Distribution:</strong> {meta.distribution}
                          </p>
                        )}
                        {meta.extraWarning && (
                          <div className={styles.extraWarning}>
                            ⚠️ {meta.extraWarning}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Offset</th>
                          <th>Variable Name</th>
                          <th>Min</th>
                          <th>Max</th>
                          <th>Resolution</th>
                          <th>Unit</th>
                          <th>Comment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {telegramEntries.map((telegram) => (
                          <tr key={telegram.id}>
                            <td className={styles.offset}>{telegram.offset}</td>
                            <td className={styles.variableName}>
                              {telegram.variableName}
                            </td>
                            <td className={styles.numeric}>{telegram.min}</td>
                            <td className={styles.numeric}>{telegram.max}</td>
                            <td className={styles.numeric}>
                              {telegram.resolution}
                            </td>
                            <td className={styles.unit}>{telegram.unit}</td>
                            <td className={styles.comment}>
                              {telegram.comment}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )
        })}
    </div>
  )
}
