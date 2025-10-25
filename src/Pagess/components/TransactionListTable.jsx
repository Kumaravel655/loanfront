import React from "react";
import StatusIndicator from "./StatusIndicator";
import styles from "./TransactionListTable.module.css";

const TransactionListTable = ({ transactions, onAction }) => (
  <table className={styles.table}>
    <thead>
      <tr>
        <th>ID</th>
        <th>User</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map((t) => (
        <tr key={t.id}>
          <td>{t.id}</td>
          <td>{t.user}</td>
          <td>₹{t.amount}</td>
          <td>
            <StatusIndicator status={t.status} />
          </td>
          <td>{t.date}</td>
          <td>
            <button
              onClick={() => onAction("approve", t)}
              className={styles.approve}
            >
              Approve
            </button>
            <button
              onClick={() => onAction("reject", t)}
              className={styles.reject}
            >
              Reject
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TransactionListTable;
