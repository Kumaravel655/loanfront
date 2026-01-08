import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartBar, FaDollarSign, FaClipboardList, FaCheckCircle, FaPercentage, FaFileExport, FaFilePdf, FaFileExcel, FaFileCsv, FaCalendarAlt } from 'react-icons/fa';
import { loanService } from '../../../services/loanService';
import PageBanner from '../shared/PageBanner';
import './CollectionReports.css';

const CollectionReports = () => {
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [agents, collections, loans] = await Promise.all([
        loanService.getCollectionAgents().catch(() => []),
        loanService.getDailyCollections().catch(() => []),
        loanService.getLoans().catch(() => [])
      ]);

      // Calculate date range
      const today = new Date();
      const startDate = dateRange === 'today' ? today :
                       dateRange === 'weekly' ? new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) :
                       new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Filter collections by date range
      const filteredCollections = collections.filter(c => {
        const collectionDate = new Date(c.collection_date);
        return collectionDate >= startDate && collectionDate <= today;
      });

      // Calculate agent performance
      const agentPerformance = agents.map(agent => {
        const agentCollections = filteredCollections.filter(c => c.agent_id === agent.id);
        const totalCollection = agentCollections.reduce((sum, c) => 
          sum + parseFloat(c.cash_total || 0) + parseFloat(c.upi_total || 0) + parseFloat(c.card_total || 0), 0
        );
        const agentLoans = loans.filter(l => l.assigned_to === agent.id);
        
        return {
          name: agent.username || agent.name || 'Unknown Agent',
          collection: totalCollection,
          target: dateRange === 'today' ? 100000 : dateRange === 'weekly' ? 500000 : 1500000,
          accounts: agentLoans.length
        };
      });

      // Calculate summary
      const totalCollection = filteredCollections.reduce((sum, c) => 
        sum + parseFloat(c.cash_total || 0) + parseFloat(c.upi_total || 0) + parseFloat(c.card_total || 0), 0
      );
      const totalTransactions = filteredCollections.length;
      const averageCollection = totalTransactions > 0 ? totalCollection / totalTransactions : 0;

      // Calculate payment methods distribution
      const cashTotal = filteredCollections.reduce((sum, c) => sum + parseFloat(c.cash_total || 0), 0);
      const upiTotal = filteredCollections.reduce((sum, c) => sum + parseFloat(c.upi_total || 0), 0);
      const cardTotal = filteredCollections.reduce((sum, c) => sum + parseFloat(c.card_total || 0), 0);
      const total = cashTotal + upiTotal + cardTotal;
      
      const paymentMethods = total > 0 ? [
        { name: 'Cash', value: Math.round((cashTotal / total) * 100), color: '#3B82F6' },
        { name: 'UPI', value: Math.round((upiTotal / total) * 100), color: '#10B981' },
        { name: 'Card', value: Math.round((cardTotal / total) * 100), color: '#F59E0B' },
        { name: 'Bank Transfer', value: 0, color: '#EF4444' }
      ] : [
        { name: 'No Data', value: 100, color: '#6B7280' }
      ];

      setReports({
        summary: {
          totalCollection,
          totalTransactions,
          averageCollection,
          successRate: totalTransactions > 0 ? ((totalTransactions - overdueSchedules.length) / totalTransactions * 100).toFixed(1) : 0
        },
        agentPerformance: agentPerformance.length > 0 ? agentPerformance : [
          { name: 'No agents found', collection: 0, target: 100000, accounts: 0 }
        ],
        paymentMethods,
        hourlyCollection: [], // Would need hourly breakdown data
        dailyCollection: [] // Would need daily breakdown data
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      // Fallback to empty data on error
      setReports({
        summary: { totalCollection: 0, totalTransactions: 0, averageCollection: 0, successRate: 0 },
        agentPerformance: [{ name: 'No data available', collection: 0, target: 0, accounts: 0 }],
        paymentMethods: [{ name: 'No Data', value: 100, color: '#6B7280' }],
        hourlyCollection: [],
        dailyCollection: []
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportReport = (format) => {
    alert(`Exporting ${dateRange} report as ${format.toUpperCase()}`);
    // In real app, this would generate and download the file
  };

  if (loading) {
    return <div className="loading">Generating reports...</div>;
  }

  return (
    <div className="collection-reports">
      <PageBanner 
        icon={FaChartBar}
        title="Collection Reports"
        subtitle="Detailed analysis of collection performance and trends"
        stats={[
          { value: formatCurrency(reports.summary?.totalCollection || 0), label: 'Total Collection' },
          { value: reports.summary?.totalTransactions || 0, label: 'Transactions' }
        ]}
      />

      <div className="report-controls">
        <select 
          value={dateRange} 
          onChange={(e) => setDateRange(e.target.value)}
          className="date-selector"
        >
          <option value="today">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">This Quarter</option>
        </select>
        <div className="export-buttons">
          <button onClick={() => exportReport('pdf')}><FaFilePdf /> PDF</button>
          <button onClick={() => exportReport('excel')}><FaFileExcel /> Excel</button>
          <button onClick={() => exportReport('csv')}><FaFileCsv /> CSV</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="summary-icon"><FaDollarSign /></div>
          <div className="summary-content">
            <h3>Total Collection</h3>
            <p className="summary-number">{formatCurrency(reports.summary.totalCollection)}</p>
            <span className="summary-trend positive">+12.5%</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="summary-icon"><FaClipboardList /></div>
          <div className="summary-content">
            <h3>Total Transactions</h3>
            <p className="summary-number">{reports.summary.totalTransactions}</p>
            <span className="summary-trend positive">+8.3%</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="summary-icon"><FaChartBar /></div>
          <div className="summary-content">
            <h3>Average Collection</h3>
            <p className="summary-number">{formatCurrency(reports.summary.averageCollection)}</p>
            <span className="summary-trend positive">+5.2%</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="summary-icon"><FaCheckCircle /></div>
          <div className="summary-content">
            <h3>Success Rate</h3>
            <p className="summary-number">{reports.summary.successRate}%</p>
            <span className="summary-trend positive">+2.1%</span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Agent Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.agentPerformance}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Collection']} />
              <Legend />
              <Bar dataKey="collection" name="Actual Collection" fill="#3B82F6" />
              <Bar dataKey="target" name="Target" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports.paymentMethods}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {reports.paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>{dateRange === 'today' ? 'Hourly' : 'Daily'} Collection Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports.hourlyCollection?.length > 0 ? reports.hourlyCollection : 
                           reports.dailyCollection?.length > 0 ? reports.dailyCollection : 
                           [{ name: 'No data', collection: 0 }]}>
              <XAxis dataKey={dateRange === 'today' ? 'hour' : 'day'} />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Collection']} />
              <Bar dataKey="collection" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Performance Metrics</h3>
          <div className="metrics-grid">
            {reports.agentPerformance.map((agent, index) => (
              <div key={agent.name} className="metric-item">
                <div className="metric-header">
                  <span className="agent-name">{agent.name}</span>
                  <span className="achievement-rate">
                    {((agent.collection / agent.target) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(100, (agent.collection / agent.target) * 100)}%`,
                      backgroundColor: (agent.collection / agent.target) >= 1 ? '#10B981' : 
                                     (agent.collection / agent.target) >= 0.8 ? '#3B82F6' : 
                                     (agent.collection / agent.target) >= 0.6 ? '#F59E0B' : '#EF4444'
                    }}
                  ></div>
                </div>
                <div className="metric-details">
                  <span>Collected: {formatCurrency(agent.collection)}</span>
                  <span>Target: {formatCurrency(agent.target)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="detailed-table">
        <h3>Agent-wise Detailed Report</h3>
        <table>
          <thead>
            <tr>
              <th>Agent Name</th>
              <th>Region</th>
              <th>Collection</th>
              <th>Target</th>
              <th>Achievement</th>
              <th>Accounts</th>
              <th>Avg/Account</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.agentPerformance.map((agent, index) => (
              <tr key={agent.name}>
                <td>
                  <div className="agent-cell">
                    <div className="agent-avatar-small">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {agent.name}
                  </div>
                </td>
                <td>{['Central', 'South', 'West', 'North', 'East'][index] + ' Zone'}</td>
                <td className="amount">{formatCurrency(agent.collection)}</td>
                <td className="amount">{formatCurrency(agent.target)}</td>
                <td>
                  <span className={`achievement ${(agent.collection / agent.target) >= 1 ? 'excellent' : 
                                         (agent.collection / agent.target) >= 0.8 ? 'good' : 
                                         (agent.collection / agent.target) >= 0.6 ? 'average' : 'poor'}`}>
                    {((agent.collection / agent.target) * 100).toFixed(1)}%
                  </span>
                </td>
                <td>{agent.accounts}</td>
                <td className="amount">{formatCurrency(agent.collection / agent.accounts)}</td>
                <td>
                  <span className={`status ${(agent.collection / agent.target) >= 0.8 ? 'active' : 'warning'}`}>
                    {(agent.collection / agent.target) >= 0.8 ? 'On Track' : 'Needs Attention'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollectionReports;