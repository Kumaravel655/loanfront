// src/components/common/Table/Table.jsx

import React from 'react';
import styles from './Table.module.css';

const Table = ({ headers, data }) => {
  if (!headers || !data) {
    return <p>No data to display.</p>;
  }

  // Get the keys from the first data object to map columns correctly
  const dataKeys = Object.keys(data[0] || {});

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {dataKeys.map((key) => (
                <td key={key} data-label={headers[dataKeys.indexOf(key)]}>
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;