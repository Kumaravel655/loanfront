import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaDollarSign, FaCheckCircle, FaTimes, FaClock } from 'react-icons/fa';
import { loanService } from '../services/loanService';
import styles from "./DisbursementTransactionsPage.module.css";

const DisbursementTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", type: "" });
  const [alert, setAlert] = useState({ visible: false, type: "", message: "" });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const loans = await loanService.getLoans();
      const collections = await loanService.getDailyCollections();
      
      const disbursements = loans.map(loan => ({
        id: loan.loan_id || loan.id,
        user: loan.customer_name || 'N/A',
        amount: loan.principal_amount || 0,
        status: loan.loan_status === 'approved' ? 'Success' : loan.loan_status === 'pending' ? 'Pending' : 'Failed',
        type: 'Disbursement',
        date: loan.created_at || new Date().toISOString().split('T')[0],
        loanId: loan.loan_id || loan.id
      }));
      
      setTransactions(disbursements);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchStatus = filters.status ? t.status === filters.status : true;
    const matchType = filters.type ? t.type === filters.type : true;
    return matchStatus && matchType;
  });

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
          <div>Loading transactions...</div>
        </div>
      </div>
    );
  }

  const handleAction = (action, transaction) => {
    const newStatus = action === "approve" ? "Success" : "Rejected";
    
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? { ...t, status: newStatus } : t)
    );

    setAlert({
      visible: true,
      type: action === "approve" ? "success" : "error",
      message: `Transaction #${transaction.id} ${action === "approve" ? "approved" : "rejected"} successfully!`
    });

    setTimeout(() => setAlert({ visible: false, type: "", message: "" }), 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      Pending: 'warning',
      Success: 'success', 
      Failed: 'danger',
      Rejected: 'danger'
    };
    return `badge-${statusClasses[status] || 'secondary'}`;
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <motion.div 
        className={styles.pageHeader}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            <FaDollarSign className={styles.titleIcon} />
            Disbursement & Transactions
          </h1>
          <p className={styles.pageSubtitle}>Manage loan disbursements and transaction approvals</p>
        </div>
      </motion.div>

      {/* Alert */}
      {alert.visible && (
        <motion.div 
          className={`${styles.alert} ${styles[alert.type]}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {alert.message}
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className={styles.statIcon}><FaClock /></div>
          <div className={styles.statContent}>
            <h3>Pending</h3>
            <p>{transactions.filter(t => t.status === 'Pending').length}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className={styles.statIcon}><FaCheckCircle /></div>
          <div className={styles.statContent}>
            <h3>Approved</h3>
            <p>{transactions.filter(t => t.status === 'Success').length}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.statCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.statIcon}><FaTimes /></div>
          <div className={styles.statContent}>
            <h3>Failed/Rejected</h3>
            <p>{transactions.filter(t => t.status === 'Failed' || t.status === 'Rejected').length}</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        className={styles.filtersCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3>Filters</h3>
        <div className={styles.filtersRow}>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className={styles.filterSelect}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <select 
            value={filters.type} 
            onChange={(e) => setFilters({...filters, type: e.target.value})}
            className={styles.filterSelect}
          >
            <option value="">All Types</option>
            <option value="Disbursement">Disbursement</option>
            <option value="Refund">Refund</option>
          </select>
          
          <button 
            onClick={() => setFilters({ status: "", type: "" })}
            className={styles.resetBtn}
          >
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div 
        className={styles.tableCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3>Transactions</h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Loan ID</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>#{transaction.id}</td>
                  <td>{transaction.user}</td>
                  <td>{transaction.loanId}</td>
                  <td>{formatCurrency(transaction.amount)}</td>
                  <td>
                    <span className={`${styles.typeBadge} ${styles[transaction.type.toLowerCase()]}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[getStatusBadge(transaction.status)]}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>
                    {transaction.status === 'Pending' && (
                      <div className={styles.actionButtons}>
                        <button 
                          onClick={() => handleAction('approve', transaction)}
                          className={`${styles.actionBtn} ${styles.approve}`}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button 
                          onClick={() => handleAction('reject', transaction)}
                          className={`${styles.actionBtn} ${styles.reject}`}
                        >
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DisbursementTransactionsPage;
