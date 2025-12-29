import React, { useState, useEffect } from 'react';
import styles from './TelegramsTable.module.css';

export default function TelegramsTable() {
  const [telegrams, setTelegrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFetched, setFilterFetched] = useState('all');

  useEffect(() => {
    fetch('/data/dump_telegrams.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.trim().split('\n');
        const headers = rows[0].split(',');
        
        const parsed = rows.slice(1).map(row => {
          const values = row.split(',');
          return {
            id: values[0],
            name: values[1],
            isFetched: values[2]?.trim() === 'fetched'
          };
        });
        
        setTelegrams(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredTelegrams = telegrams.filter(telegram => {
    const matchesSearch = 
      telegram.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      telegram.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterFetched === 'all' ||
      (filterFetched === 'fetched' && telegram.isFetched) ||
      (filterFetched === 'not-fetched' && !telegram.isFetched);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className={styles.loading}>Loading telegrams...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading telegrams: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by ID or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={filterFetched}
          onChange={(e) => setFilterFetched(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Telegrams ({telegrams.length})</option>
          <option value="fetched">Fetched Only ({telegrams.filter(t => t.isFetched).length})</option>
          <option value="not-fetched">Not Fetched ({telegrams.filter(t => !t.isFetched).length})</option>
        </select>
      </div>

      <div className={styles.stats}>
        Showing {filteredTelegrams.length} of {telegrams.length} telegrams
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTelegrams.map((telegram, index) => (
            <tr key={index}>
              <td><code>{telegram.id}</code></td>
              <td>{telegram.name}</td>
              <td>
                <span className={telegram.isFetched ? styles.fetched : styles.notFetched}>
                  {telegram.isFetched ? '✓ Fetched' : '—'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTelegrams.length === 0 && (
        <div className={styles.noResults}>
          No telegrams found matching your criteria.
        </div>
      )}
    </div>
  );
}

