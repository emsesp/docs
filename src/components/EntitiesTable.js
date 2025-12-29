import React, { useState, useEffect } from 'react';
import styles from './EntitiesTable.module.css';

export default function EntitiesTable() {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [writeableFilter, setWriteableFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetch('/data/dump_entities.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.trim().split('\n');
        
        const parsed = rows.slice(1).map((row, index) => {
          // Handle CSV with quoted fields containing commas
          const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
          const values = row.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
          
          return {
            id: index,
            deviceName: values[0] || '',
            deviceType: values[1] || '',
            productId: values[2] || '',
            shortname: values[3] || '',
            fullname: values[4] || '',
            type: values[5] || '',
            uom: values[6] || '',
            writeable: values[7]?.toLowerCase() === 'true',
            discoveryIdV34: values[8] || '',
            discoveryId: values[9] || '',
            modbusUnit: values[10] || '',
            modbusBlock: values[11] || '',
            modbusScale: values[12] || '',
            modbusOffset: values[13] || '',
            modbusCount: values[14] || ''
          };
        });
        
        setEntities(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const deviceTypes = [...new Set(entities.map(e => e.deviceType))].sort();

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = 
      entity.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.deviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDeviceType = 
      deviceTypeFilter === 'all' || entity.deviceType === deviceTypeFilter;
    
    const matchesWriteable = 
      writeableFilter === 'all' ||
      (writeableFilter === 'writeable' && entity.writeable) ||
      (writeableFilter === 'readonly' && !entity.writeable);
    
    return matchesSearch && matchesDeviceType && matchesWriteable;
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return <div className={styles.loading}>Loading entities...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading entities: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search by name, device, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={deviceTypeFilter}
          onChange={(e) => setDeviceTypeFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Device Types</option>
          {deviceTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select
          value={writeableFilter}
          onChange={(e) => setWriteableFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Entities</option>
          <option value="writeable">Writeable Only</option>
          <option value="readonly">Read-only</option>
        </select>
      </div>

      <div className={styles.stats}>
        Showing {filteredEntities.length} of {entities.length} entities
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Device</th>
              <th>Type</th>
              <th>Short Name</th>
              <th>Full Name</th>
              <th>Data Type</th>
              <th>Unit</th>
              <th>Access</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredEntities.map((entity) => (
              <React.Fragment key={entity.id}>
                <tr 
                  onClick={() => toggleRow(entity.id)}
                  className={expandedRow === entity.id ? styles.expandedRow : ''}
                >
                  <td className={styles.deviceCell}>
                    <div className={styles.deviceName}>{entity.deviceName}</div>
                    <div className={styles.productId}>ID: {entity.productId}</div>
                  </td>
                  <td><span className={styles.badge}>{entity.deviceType}</span></td>
                  <td><code>{entity.shortname}</code></td>
                  <td>{entity.fullname}</td>
                  <td className={styles.typeCell}>{entity.type}</td>
                  <td>{entity.uom}</td>
                  <td>
                    <span className={entity.writeable ? styles.writeable : styles.readonly}>
                      {entity.writeable ? '✎ Write' : '👁 Read'}
                    </span>
                  </td>
                  <td className={styles.expandIcon}>
                    {expandedRow === entity.id ? '▼' : '▶'}
                  </td>
                </tr>
                {expandedRow === entity.id && (
                  <tr className={styles.detailsRow}>
                    <td colSpan="8">
                      <div className={styles.details}>
                        <div className={styles.detailSection}>
                          <h4>Home Assistant Discovery</h4>
                          <div className={styles.detailItem}>
                            <strong>Entity ID:</strong> <code>{entity.discoveryId}</code>
                          </div>
                          <div className={styles.detailItem}>
                            <strong>v3.4 Entity ID:</strong> <code>{entity.discoveryIdV34}</code>
                          </div>
                        </div>
                        <div className={styles.detailSection}>
                          <h4>Modbus Information</h4>
                          <div className={styles.detailGrid}>
                            <div className={styles.detailItem}>
                              <strong>Unit:</strong> {entity.modbusUnit}
                            </div>
                            <div className={styles.detailItem}>
                              <strong>Block:</strong> {entity.modbusBlock}
                            </div>
                            <div className={styles.detailItem}>
                              <strong>Scale:</strong> {entity.modbusScale}
                            </div>
                            <div className={styles.detailItem}>
                              <strong>Offset:</strong> {entity.modbusOffset}
                            </div>
                            <div className={styles.detailItem}>
                              <strong>Count:</strong> {entity.modbusCount}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntities.length === 0 && (
        <div className={styles.noResults}>
          No entities found matching your criteria.
        </div>
      )}
    </div>
  );
}

