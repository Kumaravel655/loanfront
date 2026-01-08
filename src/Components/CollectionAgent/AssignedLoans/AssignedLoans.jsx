import React, { useEffect, useState } from "react";
import { loanService } from '../../../services/loanService';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaSearch, FaFilter, FaSort, FaEye, FaDollarSign } from 'react-icons/fa';
import PageBanner from '../shared/PageBanner';
import './AssignedLoans.css';

const AssignedLoans = () => {
  const [assignedLoans, setAssignedLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [sortOrder, setSortOrder] = useState("asc");

  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    fetchAssignedLoans();
  }, []);

  useEffect(() => {
    filterAndSortLoans();
  }, [assignedLoans, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchAssignedLoans = async () => {
    try {
      setLoading(true);
      setError("");
      
      const schedules = await loanService.getLoanSchedules();
      
      // Filter schedules assigned to current user
      const userSchedules = schedules.filter(schedule => 
        schedule.assigned_to === user?.id
      );
      
      setAssignedLoans(userSchedules);
      
    } catch (err) {
      console.error('Error fetching assigned loans:', err);
      setError("Failed to load assigned loan schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLoans = () => {
    let filtered = [...assignedLoans];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(loan => 
        loan.loan?.toString().includes(searchTerm) ||
        loan.installment_no?.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'due_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLoans(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClass = (dueDate, status) => {
    if (status === 'done') return '';
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return 'overdue';
    if (days <= 3) return 'urgent';
    return '';
  };

  if (loading) {
    return (
      <div className="assigned-loans">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading assigned loans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assigned-loans">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Loans</h3>
          <p>{error}</p>
          <button onClick={fetchAssignedLoans} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="assigned-loans">
      <PageBanner 
        icon={FaClipboardList}
        title="Assigned Loans"
        subtitle="Manage your assigned loan schedules and collections"
        stats={[
          { value: assignedLoans.length, label: 'Total Assigned' },
          { value: assignedLoans.filter(l => l.status === 'pending').length, label: 'Pending' },
          { value: assignedLoans.filter(l => getDaysUntilDue(l.due_date) < 0 && l.status === 'pending').length, label: 'Overdue' }
        ]}
      />

      {/* Filters and Search */}
      <motion.div 
        className="filters-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by Loan ID or Installment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon"><FaSearch /></span>
        </div>

        <div className="filter-controls">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Completed</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="due_date">Sort by Due Date</option>
            <option value="total_due">Sort by Amount</option>
            <option value="installment_no">Sort by Installment</option>
          </select>

          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-toggle"
          >
            <FaSort />
          </button>
        </div>
      </motion.div>

      {/* Loans Table */}
      <motion.div 
        className="loans-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredLoans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><FaClipboardList /></div>
            <h3>No Loans Found</h3>
            <p>No loans match your current filters.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Installment</th>
                  <th>Due Date</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Total Due</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan, index) => (
                  <motion.tr 
                    key={loan.id}
                    className={`loan-row ${getUrgencyClass(loan.due_date, loan.status)}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <td className="loan-id">
                      <span className="id-badge">#{loan.loan}</span>
                    </td>
                    <td className="installment">
                      <span className="installment-number">{loan.installment_no}</span>
                    </td>
                    <td className="due-date">
                      <div className="date-info">
                        <span className="date">{formatDate(loan.due_date)}</span>
                        <span className={`days-info ${getDaysUntilDue(loan.due_date) < 0 ? 'overdue' : getDaysUntilDue(loan.due_date) <= 3 ? 'urgent' : ''}`}>
                          {(() => {
                            const daysUntilDue = getDaysUntilDue(loan.due_date);
                            if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days overdue`;
                            if (daysUntilDue === 0) return 'Due today';
                            return `${daysUntilDue} days left`;
                          })()
                          }
                        </span>
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(loan.principal_amount)}</td>
                    <td className="amount">{formatCurrency(loan.interest_amount)}</td>
                    <td className="total-amount">
                      <span className="total-value">{formatCurrency(loan.total_due)}</span>
                    </td>
                    <td className="status">
                      <span className={`status-badge ${getStatusColor(loan.status)}`}>
                        {loan.status === 'done' ? 'Completed' : 
                         loan.status === 'pending' ? 'Pending' : 
                         loan.status}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="action-buttons">
                        <Link 
                          to={`/agent/loan/${loan.loan}`}
                          className="action-btn view"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        {loan.status === 'pending' && (
                          <Link 
                            to={`/agent/collect/${loan.loan}`}
                            className="action-btn collect"
                            title="Collect Payment"
                          >
                            <FaDollarSign />
                          </Link>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Summary Footer */}
      <motion.div 
        className="summary-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Amount Due:</span>
            <span className="summary-value">
              {formatCurrency(filteredLoans.filter(l => l.status === 'pending').reduce((sum, loan) => sum + parseFloat(loan.total_due), 0))}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Showing:</span>
            <span className="summary-value">{filteredLoans.length} of {assignedLoans.length} loans</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AssignedLoans;