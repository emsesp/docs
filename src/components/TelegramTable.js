import React, { useState, useEffect } from 'react';
import styles from './TelegramTable.module.css';

export default function TelegramTable({ csvFile, title }) {
  const [telegrams, setTelegrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [telegramFilter, setTelegramFilter] = useState('all');

  useEffect(() => {
    fetch(`/data/${csvFile}`)
      .then(response => response.text())
      .then(data => {
        const rows = data.trim().split('\n');
        
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
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [csvFile]);

  const telegramIds = [...new Set(telegrams.map(t => t.telegramId))].sort();

  const filteredTelegrams = telegrams.filter(telegram => {
    const matchesSearch = 
      telegram.variableName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.telegramId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.offset.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTelegram = 
      telegramFilter === 'all' || telegram.telegramId === telegramFilter;
    
    return matchesSearch && matchesTelegram;
  });

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
          placeholder="Search by variable name, telegram ID, offset, or comment..."
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
        Showing {filteredTelegrams.length} of {telegrams.length} entries
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Telegram ID</th>
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
            {filteredTelegrams.map((telegram) => (
              <tr key={telegram.id}>
                <td><code className={styles.telegramId}>{telegram.telegramId}</code></td>
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

      {filteredTelegrams.length === 0 && (
        <div className={styles.noResults}>
          No telegram entries found matching your criteria.
        </div>
      )}
    </div>
  );
}

