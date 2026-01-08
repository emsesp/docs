import React, { useState, useEffect } from 'react';
import styles from './TelegramTable.module.css';

export default function TelegramTable({ csvFile, title }) {
  const [telegrams, setTelegrams] = useState([]);
  const [metadata, setMetadata] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [telegramFilter, setTelegramFilter] = useState('all');
  const [expandedTelegram, setExpandedTelegram] = useState(null);

  useEffect(() => {
    // Load both CSV data and metadata
    Promise.all([
      fetch(`/data/${csvFile}`).then(res => res.text()),
      fetch('/data/telegram_metadata.json').then(res => res.json())
    ])
      .then(([csvData, metadataJson]) => {
        const rows = csvData.trim().split('\n');
        
        const parsed = rows.slice(1).map((row, index) => {
          // Handle CSV with quoted fields containing commas
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const values = row.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
          
          return {
            id: index,
            telegramId: values[0] || '',
            offset: values[1] || '',
            variableName: values[2] || '',
            min: values[3] || '',
            max: values[4] || '',
            resolution: values[5] || '',
            unit: values[6] || '',
            comment: values[7] || ''
          };
        });
        
        setTelegrams(parsed);
        setMetadata(metadataJson);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [csvFile]);

  const telegramIds = [...new Set(telegrams.map(t => t.telegramId))].sort();

  const filteredTelegrams = telegrams.filter(telegram => {
    const meta = metadata[telegram.telegramId];
    
    const matchesSearch = 
      telegram.variableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.telegramId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.offset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meta && (
        meta.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.usedIn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.emsCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meta.distribution?.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    
    const matchesTelegram = 
      telegramFilter === 'all' || telegram.telegramId === telegramFilter;
    
    return matchesSearch && matchesTelegram;
  });

  // Group telegrams by telegram ID for display
  const groupedTelegrams = filteredTelegrams.reduce((acc, telegram) => {
    if (!acc[telegram.telegramId]) {
      acc[telegram.telegramId] = [];
    }
    acc[telegram.telegramId].push(telegram);
    return acc;
  }, {});

  // Auto-expand telegrams when search is active or filter is set
  const shouldAutoExpand = searchTerm.length > 0 || telegramFilter !== 'all';

  const toggleTelegram = (telegramId) => {
    setExpandedTelegram(expandedTelegram === telegramId ? null : telegramId);
  };

  if (loading) {
    return <div className={styles.loading}>Loading telegram data...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading telegram data: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by variable, offset, telegram ID, description, device, or comment..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={telegramFilter}
          onChange={(e) => setTelegramFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Telegrams</option>
          {telegramIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <div className={styles.stats}>
        Showing {Object.keys(groupedTelegrams).length} telegram(s)
      </div>

      {Object.keys(groupedTelegrams).sort().map(telegramId => {
        const meta = metadata[telegramId];
        const telegramEntries = groupedTelegrams[telegramId];
        const isExpanded = shouldAutoExpand || expandedTelegram === telegramId;

        return (
          <div key={telegramId} className={styles.telegramSection}>
            <div className={styles.telegramHeader} onClick={() => toggleTelegram(telegramId)}>
              <h3>{telegramId} <span className={styles.telegramName}>{meta?.name}</span></h3>
              <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
            </div>

            {isExpanded && (
              <>
                {meta && (
                  <div className={`${styles.metadataBox} ${styles[meta.type]}`}>
                    <div className={styles.metadataTitle}>{meta.name}</div>
                    <div className={styles.metadataContent}>
                      <p><strong>Used in:</strong> {meta.usedIn}</p>
                      <p><strong>Description:</strong> {meta.description}</p>
                      <p><strong>Class:</strong> {meta.class}</p>
                      <p><strong>EMS category:</strong> {meta.emsCategory}</p>
                      {meta.distribution && <p><strong>Distribution:</strong> {meta.distribution}</p>}
                      {meta.extraWarning && (
                        <div className={styles.extraWarning}>⚠️ {meta.extraWarning}</div>
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
                          <td className={styles.variableName}>{telegram.variableName}</td>
                          <td className={styles.numeric}>{telegram.min}</td>
                          <td className={styles.numeric}>{telegram.max}</td>
                          <td className={styles.numeric}>{telegram.resolution}</td>
                          <td className={styles.unit}>{telegram.unit}</td>
                          <td className={styles.comment}>{telegram.comment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        );
      })}

      {filteredTelegrams.length === 0 && (
        <div className={styles.noResults}>
          No telegram entries found matching your criteria.
        </div>
      )}
    </div>
  );
}

