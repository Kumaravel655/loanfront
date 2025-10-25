import React from "react";
import styles from "./AuditLogTable.module.css";

const AuditLogTable = ({ logs }) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Audit Log</h3>

      {logs.length === 0 ? (
        <p className={styles.empty}>No actions recorded yet.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLogTable;
