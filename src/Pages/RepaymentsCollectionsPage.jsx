import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loanService } from '../services/loanService';
import { FaDollarSign, FaCheckCircle, FaClock, FaExclamationTriangle, FaSync, FaFileAlt } from 'react-icons/fa';
import './RepaymentsCollectionsPage.css';

const RepaymentsCollectionsPage = () => {
  const [repayments, setRepayments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: '', agent: '' });
  const [stats, setStats] = useState({
    totalDue: 0,
    collected: 0,
    pending: 0,
    overdue: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Try multiple API endpoints to get loan schedules
      let schedulesData = [];
      try {
        schedulesData = await loanService.getLoanSchedules();
        console.log('Loan schedules from loanService:', schedulesData);
      } catch (error) {
        console.log('loanService failed, trying direct API call');
        // Fallback to direct API call
        const token = localStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/api/auth/loan-schedules/', {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          schedulesData = await response.json();
          console.log('Loan schedules from direct API:', schedulesData);
        }
      }
      
      const [agentsData, collectionsData] = await Promise.all([
        loanService.getCollectionAgents().catch(() => []),
        loanService.getDailyCollections().catch(() => [])
      ]);
      
      setRepayments(schedulesData || []);
      setAgents(agentsData || []);
      
      // Calculate stats
      const totalDue = (schedulesData || []).reduce((sum, item) => sum + parseFloat(item.total_due || 0), 0);
      const collected = (collectionsData || []).reduce((sum, item) => sum + parseFloat(item.total_amount || 0), 0);
      const pending = (schedulesData || []).filter(item => item.status === 'pending').length;
      const overdue = (schedulesData || []).filter(item => 
        new Date(item.due_date) < new Date() && item.status === 'pending'
      ).length;
      
      setStats({ totalDue, collected, pending, overdue });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data to prevent crashes
      setRepayments([]);
      setAgents([]);
      setStats({ totalDue: 0, collected: 0, pending: 0, overdue: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filteredRepayments = repayments.filter(item => {
    const matchStatus = filters.status ? item.status === filters.status : true;
    const matchAgent = filters.agent ? item.assigned_to === parseInt(filters.agent) : true;
    return matchStatus && matchAgent;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'warning',
      done: 'success',
      overdue: 'danger'
    };
    return statusClasses[status] || 'secondary';
  };

  const handleAssignAgent = async (scheduleId, agentId) => {
    if (!agentId) return;
    
    try {
      await loanService.assignLoanSchedule(scheduleId, agentId);
      setRepayments(prev => 
        prev.map(item => 
          item.id === scheduleId ? { ...item, assigned_to: parseInt(agentId) } : item
        )
      );
    } catch (error) {
      console.error('Error assigning agent:', error);
    }
  };

  return (
    <div className="repayments-page">
      {/* Header */}
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1 className="page-title">
            <FaDollarSign className="title-icon" />
            Repayments & Collections
          </h1>
          <p className="page-subtitle">Monitor and manage loan repayments and collections</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <motion.div 
          className="stat-card primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stat-icon"><FaFileAlt /></div>
          <div className="stat-content">
            <h3>Total Due</h3>
            <p>{formatCurrency(stats.totalDue)}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <h3>Collected</h3>
            <p>{formatCurrency(stats.collected)}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-content">
            <h3>Pending</h3>
            <p>{stats.pending}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="stat-card danger"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="stat-icon"><FaExclamationTriangle /></div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p>{stats.overdue}</p>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div 
        className="filters-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3>Filters</h3>
        <div className="filters-row">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select 
            value={filters.agent} 
            onChange={(e) => setFilters({...filters, agent: e.target.value})}
            className="filter-select"
          >
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>{agent.username}</option>
            ))}
          </select>
          
          <button 
            onClick={() => setFilters({ status: '', agent: '' })}
            className="reset-btn"
          >
            Reset Filters
          </button>
        </div>
      </motion.div>

      {/* Repayments Table */}
      <motion.div 
        className="table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3>Loan Schedules</h3>
        <div className="table-container">
          {loading ? (
            <div className="loading-state">Loading repayments...</div>
          ) : filteredRepayments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FaFileAlt /></div>
              <h4>No Loan Schedules Found</h4>
              <p>There are no loan schedules available at the moment.</p>
              <button onClick={fetchData} className="retry-btn">
                <FaSync /> Retry Loading
              </button>
            </div>
          ) : (
            <table className="repayments-table">
              <thead>
                <tr>
                  <th>Loan ID</th>
                  <th>Installment</th>
                  <th>Due Date</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>Total Due</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRepayments.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.loan}</td>
                    <td>{item.installment_no}</td>
                    <td>{new Date(item.due_date).toLocaleDateString()}</td>
                    <td>{formatCurrency(item.principal_amount)}</td>
                    <td>{formatCurrency(item.interest_amount)}</td>
                    <td>{formatCurrency(item.total_due)}</td>
                    <td>
                      {item.assigned_to 
                        ? agents.find(a => a.id === item.assigned_to)?.username || 'Unknown'
                        : 'Not Assigned'
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(item.status)}`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td>
                      <select 
                        onChange={(e) => handleAssignAgent(item.id, e.target.value)}
                        className="agent-select"
                        defaultValue={item.assigned_to || ''}
                      >
                        <option value="">Assign Agent</option>
                        {agents.map(agent => (
                          <option key={agent.id} value={agent.id}>
                            {agent.username}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RepaymentsCollectionsPage;
