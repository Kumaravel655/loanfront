import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { FaExclamationTriangle, FaClock, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PageBanner from '../shared/PageBanner';
import './PendingDues.css';

const PendingDues = () => {
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, overdue: 0, urgent: 0 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPendingDues();
  }, []);

  const fetchPendingDues = async () => {
    try {
      const schedules = await loanService.getLoanSchedules();
      
      const userPending = schedules.filter(s => 
        s.assigned_to === user?.id && s.status === 'pending'
      );
      
      const today = new Date();
      const overdue = userPending.filter(s => new Date(s.due_date) < today);
      const urgent = userPending.filter(s => {
        const dueDate = new Date(s.due_date);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0;
      });
      
      const totalAmount = userPending.reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      setPendingDues(userPending.sort((a, b) => new Date(a.due_date) - new Date(b.due_date)));
      setStats({ total: totalAmount, overdue: overdue.length, urgent: urgent.length });
    } catch (error) {
      console.error('Error fetching pending dues:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyClass = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return 'overdue';
    if (days <= 3) return 'urgent';
    return 'normal';
  };

  if (loading) {
    return (
      <div className="pending-dues">
        <div className="loading">Loading pending dues...</div>
      </div>
    );
  }

  return (
    <div className="pending-dues">
      <PageBanner 
        icon={FaExclamationTriangle}
        title="Pending Dues"
        subtitle="View and manage overdue loan payments"
        stats={[
          { value: formatCurrency(stats.total), label: 'Total Pending' },
          { value: stats.overdue, label: 'Overdue' },
          { value: stats.urgent, label: 'Urgent' }
        ]}
      />
      
      <div className="dues-stats">
        <div className="stat-card">
          <FaDollarSign style={{fontSize: '2rem', color: '#f59e0b'}} />
          <h3>Total Pending</h3>
          <p className="stat-number">{formatCurrency(stats.total)}</p>
        </div>
        <div className="stat-card">
          <FaExclamationTriangle style={{fontSize: '2rem', color: '#ef4444'}} />
          <h3>Overdue</h3>
          <p className="stat-number">{stats.overdue}</p>
        </div>
        <div className="stat-card">
          <FaClock style={{fontSize: '2rem', color: '#f59e0b'}} />
          <h3>Urgent (≤3 days)</h3>
          <p className="stat-number">{stats.urgent}</p>
        </div>
      </div>

      <div className="dues-table-container">
        {pendingDues.length === 0 ? (
          <div className="no-data">No pending dues found</div>
        ) : (
          <table className="dues-table">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Installment</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Days</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingDues.map((due) => {
                const days = getDaysUntilDue(due.due_date);
                const urgencyClass = getUrgencyClass(due.due_date);
                
                return (
                  <tr key={due.id} className={urgencyClass}>
                    <td>#{due.loan}</td>
                    <td>{due.installment_no}</td>
                    <td>{new Date(due.due_date).toLocaleDateString()}</td>
                    <td>{formatCurrency(due.total_due)}</td>
                    <td>
                      <span className={`days-badge ${urgencyClass}`}>
                        {days < 0 ? `${Math.abs(days)} days overdue` : 
                         days === 0 ? 'Due today' : 
                         `${days} days left`}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge ${urgencyClass}`}>
                        {urgencyClass === 'overdue' ? 'OVERDUE' :
                         urgencyClass === 'urgent' ? 'URGENT' : 'NORMAL'}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/agent/collect/${due.loan}`}
                        className="collect-btn"
                      >
                        Collect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingDues;