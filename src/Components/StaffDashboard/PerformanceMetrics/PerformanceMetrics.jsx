import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { motion } from 'framer-motion';
import { FaChartLine, FaTrophy, FaBullseye, FaUsers, FaPercentage, FaArrowUp, FaArrowDown, FaEquals, FaMedal } from 'react-icons/fa';
import { loanService } from '../../../services/loanService';
import './PerformanceMetrics.css';

const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    overview: {
      totalAgents: 0,
      activeAgents: 0,
      overallAchievement: 0,
      avgCollection: 0,
      topPerformer: 'No data',
      improvementRate: 0
    },
    agentComparison: []
  });
  const [timeFrame, setTimeFrame] = useState('monthly');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [timeFrame, selectedAgent]);

  const fetchMetrics = async () => {
    try {
      const agents = await loanService.getCollectionAgents().catch(() => []);

      const agentComparison = agents.map(agent => {
        const collection = 0; // No collection data available
        const target = agent.monthly_target || 100000;
        const efficiency = 0;
        
        return {
          name: agent.username || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unknown',
          collection,
          efficiency,
          recovery: 0,
          satisfaction: 0,
          attendance: 0
        };
      }).sort((a, b) => b.collection - a.collection);

      const data = {
        overview: {
          totalAgents: agents.length,
          activeAgents: agents.filter(a => a.is_active).length,
          overallAchievement: agentComparison.length > 0 ? 
            (agentComparison.reduce((sum, a) => sum + a.efficiency, 0) / agentComparison.length).toFixed(1) : 0,
          avgCollection: agentComparison.length > 0 ? 
            Math.round(agentComparison.reduce((sum, a) => sum + a.collection, 0) / agentComparison.length) : 0,
          topPerformer: agentComparison.length > 0 ? agentComparison[0].name : 'No data',
          improvementRate: 0
        },
        agentComparison
      };
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics({
        overview: { totalAgents: 0, activeAgents: 0, overallAchievement: 0, avgCollection: 0, topPerformer: 'No data', improvementRate: 0 },
        agentComparison: []
      });
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <FaArrowUp />;
      case 'down': return <FaArrowDown />;
      default: return <FaEquals />;
    }
  };

  if (loading) {
    return <div className="loading">Loading performance metrics...</div>;
  }

  return (
    <div className="performance-metrics">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1><FaChartLine /> Performance Metrics</h1>
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
      </motion.div>

      {/* Overview Cards */}
      <div className="overview-cards">
        <motion.div 
          className="overview-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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
        </motion.div>

        <motion.div 
          className="overview-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-header">
            <h3>Top Performer</h3>
            <span className="badge excellent"><FaTrophy /></span>
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
        </motion.div>

        <motion.div 
          className="overview-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
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
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          <div className="chart-card large">
            <h3>Monthly Collection Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[]}>
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
              <RadarChart data={metrics.agentComparison?.slice(0, 3) || []}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                {metrics.agentComparison?.slice(0, 3).map((agent, index) => (
                  <Radar 
                    key={agent.name}
                    name={agent.name} 
                    dataKey="efficiency" 
                    stroke={['#3B82F6', '#10B981', '#F59E0B'][index]} 
                    fill={['#3B82F6', '#10B981', '#F59E0B'][index]} 
                    fillOpacity={0.6} 
                  />
                ))}
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Collection Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.agentComparison || []}>
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
          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Collection Efficiency</h4>
              <span className="trend up">{getTrendIcon('up')}</span>
            </div>
            <div className="kpi-value">
              <span className="current">{metrics.overview.overallAchievement}%</span>
              <span className="target">Target: 85%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min(100, (metrics.overview.overallAchievement / 85) * 100)}%`,
                  backgroundColor: metrics.overview.overallAchievement >= 85 ? '#10B981' : '#EF4444'
                }}
              ></div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Active Agents</h4>
              <span className="trend up">{getTrendIcon('up')}</span>
            </div>
            <div className="kpi-value">
              <span className="current">{metrics.overview.activeAgents}</span>
              <span className="target">Total: {metrics.overview.totalAgents}</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${metrics.overview.totalAgents > 0 ? (metrics.overview.activeAgents / metrics.overview.totalAgents) * 100 : 0}%`,
                  backgroundColor: '#10B981'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Ranking */}
      <div className="ranking-section">
        <h3>Agent Performance Ranking</h3>
        <div className="ranking-table">
          {(metrics.agentComparison || []).map((agent, index) => (
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
                  {index === 0 ? <><FaMedal /> Excellent</> : 
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