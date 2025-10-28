import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './CollectionReports.css';

const CollectionReports = () => {
  const [reports, setReports] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setTimeout(() => {
      const data = {
        today: {
          summary: {
            totalCollection: 254000,
            totalTransactions: 156,
            averageCollection: 1628,
            successRate: 94.2
          },
          agentPerformance: [
            { name: 'Priya Sharma', collection: 152000, target: 150000, accounts: 42 },
            { name: 'Ravi Kumar', collection: 124500, target: 120000, accounts: 38 },
            { name: 'Meena Patel', collection: 98000, target: 130000, accounts: 35 },
            { name: 'Rahul Dev', collection: 62000, target: 100000, accounts: 25 },
            { name: 'Ankit Singh', collection: 45000, target: 80000, accounts: 16 }
          ],
          paymentMethods: [
            { name: 'Cash', value: 45, color: '#3B82F6' },
            { name: 'UPI', value: 35, color: '#10B981' },
            { name: 'Card', value: 12, color: '#F59E0B' },
            { name: 'Bank Transfer', value: 8, color: '#EF4444' }
          ],
          hourlyCollection: [
            { hour: '9 AM', collection: 25000 },
            { hour: '10 AM', collection: 42000 },
            { hour: '11 AM', collection: 38000 },
            { hour: '12 PM', collection: 32000 },
            { hour: '1 PM', collection: 18000 },
            { hour: '2 PM', collection: 35000 },
            { hour: '3 PM', collection: 41000 },
            { hour: '4 PM', collection: 23000 }
          ]
        },
        weekly: {
          summary: {
            totalCollection: 1850000,
            totalTransactions: 985,
            averageCollection: 1878,
            successRate: 92.5
          },
          agentPerformance: [
            { name: 'Priya Sharma', collection: 520000, target: 500000, accounts: 145 },
            { name: 'Ravi Kumar', collection: 485000, target: 450000, accounts: 132 },
            { name: 'Meena Patel', collection: 385000, target: 400000, accounts: 118 },
            { name: 'Rahul Dev', collection: 285000, target: 350000, accounts: 95 },
            { name: 'Ankit Singh', collection: 175000, target: 250000, accounts: 65 }
          ],
          paymentMethods: [
            { name: 'Cash', value: 42, color: '#3B82F6' },
            { name: 'UPI', value: 38, color: '#10B981' },
            { name: 'Card', value: 15, color: '#F59E0B' },
            { name: 'Bank Transfer', value: 5, color: '#EF4444' }
          ],
          dailyCollection: [
            { day: 'Mon', collection: 320000 },
            { day: 'Tue', collection: 380000 },
            { day: 'Wed', collection: 295000 },
            { day: 'Thu', collection: 410000 },
            { day: 'Fri', collection: 285000 },
            { day: 'Sat', collection: 160000 }
          ]
        }
      };

      setReports(data[dateRange]);
      setLoading(false);
    }, 800);
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
      <div className="page-header">
        <div>
          <h1>Collection Reports</h1>
          <p>Detailed analysis of collection performance and trends</p>
        </div>
        <div className="header-actions">
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
            <button onClick={() => exportReport('pdf')}>📄 PDF</button>
            <button onClick={() => exportReport('excel')}>📊 Excel</button>
            <button onClick={() => exportReport('csv')}>📁 CSV</button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon">💰</div>
          <div className="summary-content">
            <h3>Total Collection</h3>
            <p className="summary-number">{formatCurrency(reports.summary.totalCollection)}</p>
            <span className="summary-trend positive">+12.5%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📋</div>
          <div className="summary-content">
            <h3>Total Transactions</h3>
            <p className="summary-number">{reports.summary.totalTransactions}</p>
            <span className="summary-trend positive">+8.3%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📊</div>
          <div className="summary-content">
            <h3>Average Collection</h3>
            <p className="summary-number">{formatCurrency(reports.summary.averageCollection)}</p>
            <span className="summary-trend positive">+5.2%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-content">
            <h3>Success Rate</h3>
            <p className="summary-number">{reports.summary.successRate}%</p>
            <span className="summary-trend positive">+2.1%</span>
          </div>
        </div>
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
            <BarChart data={dateRange === 'today' ? reports.hourlyCollection : reports.dailyCollection}>
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