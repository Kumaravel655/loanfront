import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { loanService } from '../services/loanService';
import { motion } from 'framer-motion';
import { FaBriefcase, FaDollarSign, FaClock, FaExclamationTriangle, FaUsers, FaUserTie, FaChartBar, FaHandPaper, FaClipboardList, FaSync, FaCheck, FaBolt, FaChartLine, FaBullseye, FaSearch } from 'react-icons/fa';

import Sidebar from "../components/layout/Sidebar/Sidebar";
import Navbar from "../components/layout/Navbar/Navbar";

import LoanApplicationsPage from "../features/loanApplications/LoanApplicationsPage";
import CustomerManagement from "../Pages/CustomerManagement";
import RepaymentsCollectionsPage from "../Pages/RepaymentsCollectionsPage";
import DisbursementTransactionsPage from "../Pagess/Disbursements";
import RolesPermissionsPage from "../Pagess/RolesPermissionsPage";
import Profile from "../Components/Profile/Profile";
import Settings from "../Components/Settings/Settings";
import AgentManagement from "../Components/StaffDashboard/AgentManagement/AgentManagement";
import CollectionReports from "../Components/StaffDashboard/CollectionReports/CollectionReports";
import Notifications from "../Components/Notifications/Notifications";

import LoanManagement from "../Components/LoanManagement/LoanManagement";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "./AdminDashboard.css";

// Dashboard Overview Component with Real Data
const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLoans: 0,
    totalCustomers: 0,
    totalAgents: 0,
    overdueLoans: 0,
    todayCollection: 0,
    pendingAmount: 0,
    recentLoans: [],
    monthlyTrend: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));
      
      // Fetch all required data
      const [loans, customers, agents, schedules, collections] = await Promise.all([
        loanService.getLoans().catch(err => { console.error('Loans fetch failed:', err); return []; }),
        loanService.getCustomers().catch(err => { console.error('Customers fetch failed:', err); return []; }),
        loanService.getCollectionAgents().catch(err => { console.error('Agents fetch failed:', err); return []; }),
        loanService.getLoanSchedules().catch(err => { console.error('Schedules fetch failed:', err); return []; }),
        loanService.getDailyCollections().catch(err => { console.error('Collections fetch failed:', err); return []; })
      ]);
      
      // Calculate metrics
      const today = new Date().toISOString().split('T')[0];
      const overdueSchedules = schedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      
      const todayCollections = collections.filter(c => c.collection_date === today);
      const todayCollection = todayCollections.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
      
      const pendingSchedules = schedules.filter(s => s.status === 'pending');
      const pendingAmount = pendingSchedules.reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      // Generate monthly trend from collections data
      const monthlyTrend = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const currentMonth = new Date().getMonth();
      
      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - 5 + i + 12) % 12;
        const monthName = months[monthIndex];
        const monthCollections = collections.filter(c => {
          const collectionDate = new Date(c.collection_date);
          return collectionDate.getMonth() === monthIndex;
        });
        const monthAmount = monthCollections.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
        monthlyTrend.push({ month: monthName, amount: monthAmount });
      }
      
      // Calculate real performance metrics
      const totalSchedules = schedules.length;
      const completedSchedules = schedules.filter(s => s.status === 'paid').length;
      const collectionRate = totalSchedules > 0 ? ((completedSchedules / totalSchedules) * 100).toFixed(1) : 0;
      const defaultRate = totalSchedules > 0 ? ((overdueSchedules.length / totalSchedules) * 100).toFixed(1) : 0;
      
      // Calculate growth rate (comparing current month to previous month)
      const currentMonthCollections = collections.filter(c => {
        const date = new Date(c.collection_date);
        return date.getMonth() === new Date().getMonth();
      }).reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
      
      const previousMonthCollections = collections.filter(c => {
        const date = new Date(c.collection_date);
        return date.getMonth() === new Date().getMonth() - 1;
      }).reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
      
      const growthRate = previousMonthCollections > 0 ? 
        (((currentMonthCollections - previousMonthCollections) / previousMonthCollections) * 100).toFixed(1) : 0;
      
      // Calculate target achievement (assuming monthly target)
      const monthlyTarget = 1000000; // This should come from settings
      const targetAchievement = ((currentMonthCollections / monthlyTarget) * 100).toFixed(1);
      
      setDashboardData({
        totalLoans: loans.length,
        totalCustomers: customers.length,
        totalAgents: agents.length,
        overdueLoans: overdueSchedules.length,
        todayCollection,
        pendingAmount,
        recentLoans: loans.slice(0, 5),
        monthlyTrend,
        collectionRate,
        defaultRate,
        growthRate,
        targetAchievement,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data'
      }));
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('en-IN');
  };

  if (dashboardData.loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content">
      {/* Welcome Section */}
      <motion.div 
        className="welcome-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'white',
          padding: '24px 32px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1 style={{
            margin: '0 0 4px 0',
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827'
          }}>Dashboard Overview</h1>
          
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#6b7280'
          }}>Here's what's happening with your business today</p>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            padding: '8px 16px',
            background: '#f3f4f6',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#374151',
            fontWeight: '500'
          }}>
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          
          <div style={{
            width: '40px',
            height: '40px',
            background: '#3b82f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FaChartBar size={18} color="white" />
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <motion.div 
          className="admin-metric-card primary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="metric-icon"><FaBriefcase /></div>
          <div className="metric-content">
            <h3>Total Loans</h3>
            <p className="metric-value">{dashboardData.totalLoans.toLocaleString()}</p>
            <span className="metric-label">Active loans</span>
          </div>
        </motion.div>

        <motion.div 
          className="admin-metric-card success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="metric-icon"><FaDollarSign /></div>
          <div className="metric-content">
            <h3>Today's Collection</h3>
            <p className="metric-value">{formatCurrency(dashboardData.todayCollection)}</p>
            <span className="metric-label">Collected today</span>
          </div>
        </motion.div>

        <motion.div 
          className="admin-metric-card warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="metric-icon"><FaClock /></div>
          <div className="metric-content">
            <h3>Pending Amount</h3>
            <p className="metric-value">{formatCurrency(dashboardData.pendingAmount)}</p>
            <span className="metric-label">Outstanding</span>
          </div>
        </motion.div>

        <motion.div 
          className="admin-metric-card danger"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="metric-icon"><FaExclamationTriangle /></div>
          <div className="metric-content">
            <h3>Overdue Loans</h3>
            <p className="metric-value">{dashboardData.overdueLoans}</p>
            <span className="metric-label">Need attention</span>
          </div>
        </motion.div>

        <motion.div 
          className="admin-metric-card info"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="metric-icon"><FaUsers /></div>
          <div className="metric-content">
            <h3>Total Customers</h3>
            <p className="metric-value">{dashboardData.totalCustomers.toLocaleString()}</p>
            <span className="metric-label">Registered</span>
          </div>
        </motion.div>

        <motion.div 
          className="admin-metric-card secondary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="metric-icon"><FaUserTie /></div>
          <div className="metric-content">
            <h3>Collection Agents</h3>
            <p className="metric-value">{dashboardData.totalAgents}</p>
            <span className="metric-label">Active agents</span>
          </div>
        </motion.div>
      </div>

      {/* Charts and Analytics */}
      <div className="analytics-section" style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9'
          }}
        >
          <div className="chart-header" style={{
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <FaChartBar style={{ color: '#3b82f6', fontSize: '18px' }} />
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>Monthly Collection Trend</h3>
            </div>
            <span className="chart-subtitle" style={{
              fontSize: '14px',
              color: '#64748b'
            }}>Last 6 months performance</span>
          </div>
          <div className="chart-content">
            <div className="chart-bars" style={{
              display: 'flex',
              alignItems: 'end',
              gap: '12px',
              height: '140px',
              padding: '0 8px'
            }}>
              {dashboardData.monthlyTrend.map((item, index) => {
                const maxAmount = Math.max(...dashboardData.monthlyTrend.map(i => i.amount));
                const height = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 15;
                return (
                  <div key={item.month} className="chart-bar-container" style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div
                      className="chart-bar"
                      style={{ 
                        width: '100%',
                        maxWidth: '40px',
                        height: `${height}px`,
                        background: `linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)`,
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)',
                        animation: `slideUp 0.6s ease ${index * 0.1}s both`
                      }}
                      title={`${item.month}: ${formatCurrency(item.amount)}`}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.2)';
                      }}
                    ></div>
                    <span className="chart-label" style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#64748b'
                    }}>{item.month}</span>
                    <span className="chart-value" style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      fontWeight: '400'
                    }}>{formatCurrency(item.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="quick-stats-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="stats-header">
            <h3><FaBolt /> Quick Stats</h3>
            <span className="stats-subtitle">Key performance indicators</span>
          </div>
          <div className="stats-list">
            <div className="stat-item">
              <div className="stat-icon success"><FaCheck /></div>
              <div className="stat-info">
                <span className="stat-label">Collection Rate</span>
                <span className="stat-value">{dashboardData.collectionRate}%</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon warning"><FaExclamationTriangle /></div>
              <div className="stat-info">
                <span className="stat-label">Default Rate</span>
                <span className="stat-value">{dashboardData.defaultRate}%</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon info"><FaChartLine /></div>
              <div className="stat-info">
                <span className="stat-label">Growth Rate</span>
                <span className="stat-value">{dashboardData.growthRate >= 0 ? '+' : ''}{dashboardData.growthRate}%</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon primary"><FaBullseye /></div>
              <div className="stat-info">
                <span className="stat-label">Target Achievement</span>
                <span className="stat-value">{dashboardData.targetAchievement}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        className="admin-quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h3>Quick Actions</h3>
        <div className="admin-actions-grid">
          <button className="admin-action-btn primary" onClick={() => window.location.href = '/admin/loan-applications'}>
            <span className="action-icon"><FaClipboardList /></span>
            <span>New Loan Application</span>
          </button>
          <button className="admin-action-btn secondary" onClick={() => window.location.href = '/admin/customers'}>
            <span className="action-icon"><FaUsers /></span>
            <span>Manage Customers</span>
          </button>
          <button className="admin-action-btn tertiary" onClick={() => window.location.href = '/admin/repayments'}>
            <span className="action-icon"><FaDollarSign /></span>
            <span>View Collections</span>
          </button>
          <button className="admin-action-btn quaternary" onClick={fetchDashboardData}>
            <span className="action-icon"><FaSync /></span>
            <span>Refresh Data</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Add CSS animations
const chartStyles = `
  @keyframes slideUp {
    0% { 
      height: 0;
      opacity: 0;
    }
    100% { 
      opacity: 1;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = chartStyles;
  document.head.appendChild(styleSheet);
}

// Placeholder for under-construction pages
const PlaceholderPage = ({ title }) => (
  <div className="placeholder-page">
    <div className="placeholder-content">
      <div className="placeholder-icon" style={{
        fontSize: '48px',
        marginBottom: '16px',
        color: '#f59e0b'
      }}>
        <FaExclamationTriangle />
      </div>
      <h1>{title}</h1>
      <p>This page is under construction. Please check back later.</p>
      <button 
        className="back-btn"
        onClick={() => window.history.back()}
      >
        ← Go Back
      </button>
    </div>
  </div>
);

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="admin-dashboard">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`admin-main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="admin-content-area">
          <Routes>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/loan-applications" element={<LoanApplicationsPage />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/loans" element={<LoanManagement />} />
            <Route path="/repayments" element={<RepaymentsCollectionsPage />} />
            <Route path="/disbursements" element={<DisbursementTransactionsPage />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/reports" element={<CollectionReports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/roles" element={<RolesPermissionsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<PlaceholderPage title="404: Page Not Found" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;