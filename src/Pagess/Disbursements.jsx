import React, { useState } from "react";
import styles from "./DisbursementTransactionsPage.module.css";

import FilterBar from "./components/FilterBar";
import TransactionListTable from "./components/TransactionListTable";
import NotesSection from "./components/NotesSection";
import AuditLogTable from "./components/AuditLogTable";

const DisbursementTransactionsPage = () => {
  // ===== Transactions =====
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      user: "Ravi",
      amount: 5000,
      status: "Pending",
      type: "Disbursement",
      date: "2025-10-15",
    },
    {
      id: 2,
      user: "Sneha",
      amount: 7000,
      status: "Success",
      type: "Refund",
      date: "2025-10-16",
    },
    {
      id: 3,
      user: "Mani",
      amount: 6000,
      status: "Failed",
      type: "Disbursement",
      date: "2025-10-17",
    },
    {
      id: 4,
      user: "Kumar",
      amount: 8000,
      status: "Pending",
      type: "Disbursement",
      date: "2025-10-18",
    },
  ]);

  // ===== Filters =====
  const [filteredTransactions, setFilteredTransactions] =
    useState(transactions);
  const [filters, setFilters] = useState({ date: "", status: "", type: "" });

  // ===== Logs =====
  const [logs, setLogs] = useState([]);

  // ===== Alert Card =====
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });

  // ===== Filtering Logic =====
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    const filtered = transactions.filter((t) => {
      const matchStatus = newFilters.status
        ? t.status === newFilters.status
        : true;
      const matchType = newFilters.type ? t.type === newFilters.type : true;
      const matchDate = newFilters.date ? t.date === newFilters.date : true;
      return matchStatus && matchType && matchDate;
    });

    setFilteredTransactions(filtered);
  };

  const resetFilters = () => {
    setFilters({ date: "", status: "", type: "" });
    setFilteredTransactions(transactions);
  };

  // ===== Approve / Reject Action =====
  const handleAction = (action, transaction) => {
    const newStatus = action === "approve" ? "Success" : "Rejected";

    // Update transaction status
    const updatedTransactions = transactions.map((t) =>
      t.id === transaction.id ? { ...t, status: newStatus } : t
    );
    setTransactions(updatedTransactions);

    // Apply filters after update
    const filtered = updatedTransactions.filter((t) => {
      const matchStatus = filters.status ? t.status === filters.status : true;
      const matchType = filters.type ? t.type === filters.type : true;
      const matchDate = filters.date ? t.date === filters.date : true;
      return matchStatus && matchType && matchDate;
    });
    setFilteredTransactions(filtered);

    // Add audit log
    setLogs((prev) => [
      ...prev,
      {
        user: "Admin",
        action: `${action.toUpperCase()} transaction #${transaction.id}`,
        timestamp: new Date().toLocaleString(),
      },
    ]);

    // Show alert card
    setAlert({
      visible: true,
      type: action === "approve" ? "success" : "error",
      message:
        action === "approve"
          ? `✅ Transaction #${transaction.id} Approved Successfully!`
          : `❌ Transaction #${transaction.id} Rejected.`,
    });

    // Hide alert after 4 seconds
    setTimeout(() => setAlert({ visible: false, type: "", message: "" }), 4000);
  };

  // ===== Notes =====
  const handleAddNote = (note) => {
    setLogs((prev) => [
      ...prev,
      {
        user: "Admin",
        action: `Added note: ${note}`,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  // ===== Render =====
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Disbursement & Transactions</h1>

      {/* Alert Card */}
      {alert.visible && (
        <div
          className={`${styles.alertCard} ${
            alert.type === "success" ? styles.success : styles.error
          }`}
        >
          {alert.message}
        </div>
      )}

      {/* Pending Disbursements */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Pending Disbursements</h2>
        <FilterBar onFilterChange={handleFilterChange} />
        <button
          onClick={resetFilters}
          style={{
            marginBottom: "1rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Reset Filters
        </button>
        <TransactionListTable
          transactions={filteredTransactions}
          onAction={handleAction}
        />
      </section>

      {/* Approval Workflow */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Approval Workflow</h2>
        <NotesSection onAddNote={handleAddNote} />
      </section>

      {/* Transaction History / Audit Logs */}
      <section className={styles.section}>
        <h2 className={styles.subTitle}>Transaction History</h2>
        <AuditLogTable logs={logs} />
      </section>
    </div>
  );
};

export default DisbursementTransactionsPage;
