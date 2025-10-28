import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import './PerformanceMetrics.css';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({});
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [timeFrame, selectedAgent]);

  const fetchMetrics = async () => {
    setTimeout(() => {
      const data = {
        overview: {
          totalAgents: 25,
          activeAgents: 18,
          overallAchievement: 87.5,
          avgCollection: 1628,
          topPerformer: 'Priya Sharma',
          improvementRate: 12.3
        },
        trendData: [
          { month: 'Jan', collection: 1850000, target: 2000000, accounts: 985 },
          { month: 'Feb', collection: 2100000, target: 2200000, accounts: 1120 },
          { month: 'Mar', collection: 1950000, target: 2100000, accounts: 1045 },
          { month: 'Apr', collection: 2250000, target: 2300000, accounts: 1180 },
          { month: 'May', collection: 2400000, target: 2400000, accounts: 1250 },
          { month: 'Jun', collection: 2540000, target: 2500000, accounts: 1320 }
        ],
        agentComparison: [
          { name: 'Priya Sharma', collection: 1520000, efficiency: 94, recovery: 88, satisfaction: 92, attendance: 98 },
          { name: 'Ravi Kumar', collection: 1245000, efficiency: 87, recovery: 82, satisfaction: 85, attendance: 95 },
          { name: 'Meena Patel', collection: 980000, efficiency: 78, recovery: 75, satisfaction: 80, attendance: 92 },
          { name: 'Rahul Dev', collection: 620000, efficiency: 65, recovery: 58, satisfaction: 72, attendance: 85 },
          { name: 'Ankit Singh', collection: 450000, efficiency: 58, recovery: 52, satisfaction: 68, attendance: 88 }
        ],
        kpiData: [
          { metric: 'Collection Efficiency', current: 87.5, target: 85, trend: 'up' },
          { metric: 'Recovery Rate', current: 82.3, target: 80, trend: 'up' },
          { metric: 'Customer Satisfaction', current: 89.1, target: 85, trend: 'up' },
          { metric: 'Agent Attendance', current: 93.7, target: 90, trend: 'stable' },
          { metric: 'On-time Collections', current: 78.5, target: 80, trend: 'down' }
        ]
      };
      setMetrics(data);
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return <div className="loading">Loading performance metrics...</div>;
  }

  return (
    <div className="performance-metrics">
      <div className="page-header">
        <div>
          <h1>Performance Metrics</h1>
          <p>Comprehensive analysis of team performance and KPIs</p>
        </div>
        <div className="filters">
          <select value={timeFrame} onChange={(e) => setTimeFrame(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="all">All Agents</option>
            <option value="priya">Priya Sharma</option>
            <option value="ravi">Ravi Kumar</option>
            <option value="meena">Meena Patel</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <div className="overview-card">
          <div className="card-header">
            <h3>Team Performance</h3>
            <span className="trend positive">+{metrics.overview.improvementRate}%</span>
          </div>
          <div className="card-content">
            <div className="metric-large">{metrics.overview.overallAchievement}%</div>
            <p>Overall Achievement Rate</p>
          </div>
          <div className="card-footer">
            <span>{metrics.overview.activeAgents}/{metrics.overview.totalAgents} Active Agents</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Top Performer</h3>
            <span className="badge excellent">🏆</span>
          </div>
          <div className="card-content">
            <div className="top-performer">
              <div className="performer-avatar">
                {metrics.overview.topPerformer.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="performer-info">
                <strong>{metrics.overview.topPerformer}</strong>
                <span>152% Target Achievement</span>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <span>Avg: {formatCurrency(metrics.overview.avgCollection)}/transaction</span>
          </div>
        </div>

        <div className="overview-card">
          <div className="card-header">
            <h3>Efficiency Score</h3>
            <span className="trend positive">+5.2%</span>
          </div>
          <div className="card-content">
            <div className="efficiency-circle">
              <div className="circle-progress" style={{ '--progress': '87' }}>
                87%
              </div>
            </div>
            <p>Collection Efficiency</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card large">
            <h3>Monthly Collection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics.trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Legend />
                <Line type="monotone" dataKey="collection" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="target" stroke="#E5E7EB" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-row">
          <div className="chart-card">
            <h3>Agent Performance Radar</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={metrics.agentComparison.slice(0, 3)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="Priya Sharma" dataKey="efficiency" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Radar name="Ravi Kumar" dataKey="efficiency" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Collection Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.agentComparison}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Collection']} />
                <Bar dataKey="collection" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="kpi-section">
        <h3>Key Performance Indicators</h3>
        <div className="kpi-grid">
          {metrics.kpiData.map((kpi, index) => (
            <div key={kpi.metric} className="kpi-card">
              <div className="kpi-header">
                <h4>{kpi.metric}</h4>
                <span className={`trend ${kpi.trend}`}>
                  {getTrendIcon(kpi.trend)}
                </span>
              </div>
              <div className="kpi-value">
                <span className="current">{kpi.current}%</span>
                <span className="target">Target: {kpi.target}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(kpi.current / kpi.target) * 100}%`,
                    backgroundColor: kpi.current >= kpi.target ? '#10B981' : '#EF4444'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Ranking */}
      <div className="ranking-section">
        <h3>Agent Performance Ranking</h3>
        <div className="ranking-table">
          {metrics.agentComparison.map((agent, index) => (
            <div key={agent.name} className="ranking-item">
              <div className="rank">#{index + 1}</div>
              <div className="agent-info">
                <div className="agent-avatar">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-stats">
                    <span>Efficiency: {agent.efficiency}%</span>
                    <span>Recovery: {agent.recovery}%</span>
                  </div>
                </div>
              </div>
              <div className="collection-amount">
                {formatCurrency(agent.collection)}
              </div>
              <div className="performance-badge">
                <span className={`badge ${
                  index === 0 ? 'excellent' : 
                  index < 3 ? 'good' : 
                  index < 4 ? 'average' : 'poor'
                }`}>
                  {index === 0 ? 'Excellent' : 
                   index < 3 ? 'Good' : 
                   index < 4 ? 'Average' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;