import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './TargetSetting.css';

const TargetSetting = () => {
  const [targets, setTargets] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('individual');
  const [showSetTarget, setShowSetTarget] = useState(false);
  const [newTarget, setNewTarget] = useState({
    agentId: '',
    targetAmount: '',
    period: 'monthly',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTargetData();
  }, []);

  const fetchTargetData = async () => {
    setTimeout(() => {
      setTargets({
        teamTarget: {
          current: 2500000,
          previous: 2200000,
          achievement: 87.5,
          growth: 13.6
        },
        individualTargets: [
          {
            id: 1,
            name: 'Priya Sharma',
            currentTarget: 150000,
            previousTarget: 140000,
            currentAchievement: 152000,
            previousAchievement: 135000,
            growth: 12.6,
            performance: 'exceeding'
          },
          {
            id: 2,
            name: 'Ravi Kumar',
            currentTarget: 120000,
            previousTarget: 110000,
            currentAchievement: 124500,
            previousAchievement: 108000,
            growth: 15.3,
            performance: 'exceeding'
          },
          {
            id: 3,
            name: 'Meena Patel',
            currentTarget: 130000,
            previousTarget: 125000,
            currentAchievement: 98000,
            previousAchievement: 118000,
            growth: -16.9,
            performance: 'below'
          },
          {
            id: 4,
            name: 'Rahul Dev',
            currentTarget: 100000,
            previousTarget: 95000,
            currentAchievement: 62000,
            previousAchievement: 88000,
            growth: -29.5,
            performance: 'below'
          },
          {
            id: 5,
            name: 'Ankit Singh',
            currentTarget: 80000,
            previousTarget: 75000,
            currentAchievement: 45000,
            previousAchievement: 72000,
            growth: -37.5,
            performance: 'below'
          }
        ],
        targetTrend: [
          { month: 'Jan', target: 2000000, actual: 1850000 },
          { month: 'Feb', target: 2200000, actual: 2100000 },
          { month: 'Mar', target: 2100000, actual: 1950000 },
          { month: 'Apr', target: 2300000, actual: 2250000 },
          { month: 'May', target: 2400000, actual: 2400000 },
          { month: 'Jun', target: 2500000, actual: 2540000 }
        ],
        performanceDistribution: [
          { range: 'Exceeding Target', count: 2, color: '#10B981' },
          { range: 'Meeting Target', count: 0, color: '#3B82F6' },
          { range: 'Below Target', count: 3, color: '#EF4444' },
          { range: 'Far Below Target', count: 0, color: '#DC2626' }
        ]
      });
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

  const handleSetTarget = (e) => {
    e.preventDefault();
    // In real app, this would call an API
    alert(`Target set for agent ${newTarget.agentId}: ${formatCurrency(newTarget.targetAmount)}`);
    setShowSetTarget(false);
    setNewTarget({
      agentId: '',
      targetAmount: '',
      period: 'monthly',
      startDate: '',
      endDate: ''
    });
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'exceeding': return '#10B981';
      case 'meeting': return '#3B82F6';
      case 'below': return '#EF4444';
      case 'far below': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const calculateAchievementRate = (achievement, target) => {
    return ((achievement / target) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="loading">Loading target data...</div>;
  }

  return (
    <div className="target-setting">
      <div className="page-header">
        <div>
          <h1>Target Setting</h1>
          <p>Set and monitor collection targets for your team</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowSetTarget(true)}
        >
          🎯 Set New Target
        </button>
      </div>

      {/* Team Target Overview */}
      <div className="team-target-overview">
        <div className="target-card">
          <div className="target-header">
            <h3>Team Monthly Target</h3>
            <span className="trend positive">+{targets.teamTarget.growth}%</span>
          </div>
          <div className="target-content">
            <div className="target-amount">{formatCurrency(targets.teamTarget.current)}</div>
            <div className="target-details">
              <div className="detail">
                <span>Previous: {formatCurrency(targets.teamTarget.previous)}</span>
                <span>Achievement: {targets.teamTarget.achievement}%</span>
              </div>
            </div>
          </div>
          <div className="target-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${targets.teamTarget.achievement}%`,
                  backgroundColor: targets.teamTarget.achievement >= 100 ? '#10B981' : 
                                 targets.teamTarget.achievement >= 80 ? '#3B82F6' : 
                                 targets.teamTarget.achievement >= 60 ? '#F59E0B' : '#EF4444'
                }}
              ></div>
            </div>
            <span className="progress-text">{targets.teamTarget.achievement}% Achieved</span>
          </div>
        </div>

        <div className="performance-distribution">
          <h3>Performance Distribution</h3>
          <div className="distribution-cards">
            {targets.performanceDistribution.map((item, index) => (
              <div key={item.range} className="distribution-card">
                <div 
                  className="distribution-color"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="distribution-content">
                  <div className="distribution-count">{item.count}</div>
                  <div className="distribution-label">{item.range}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={activeTab === 'individual' ? 'active' : ''}
          onClick={() => setActiveTab('individual')}
        >
          Individual Targets
        </button>
        <button 
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
        >
          Target Trends
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Target Settings
        </button>
      </div>

      {/* Individual Targets */}
      {activeTab === 'individual' && (
        <div className="individual-targets">
          <div className="targets-table">
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Current Target</th>
                  <th>Current Achievement</th>
                  <th>Achievement Rate</th>
                  <th>Previous Target</th>
                  <th>Growth</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {targets.individualTargets.map(agent => (
                  <tr key={agent.id}>
                    <td>
                      <div className="agent-info">
                        <div className="agent-avatar">
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {agent.name}
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(agent.currentTarget)}</td>
                    <td className="amount">{formatCurrency(agent.currentAchievement)}</td>
                    <td>
                      <span className={`achievement-rate ${
                        calculateAchievementRate(agent.currentAchievement, agent.currentTarget) >= 100 ? 'excellent' :
                        calculateAchievementRate(agent.currentAchievement, agent.currentTarget) >= 80 ? 'good' :
                        calculateAchievementRate(agent.currentAchievement, agent.currentTarget) >= 60 ? 'average' : 'poor'
                      }`}>
                        {calculateAchievementRate(agent.currentAchievement, agent.currentTarget)}%
                      </span>
                    </td>
                    <td className="amount">{formatCurrency(agent.previousTarget)}</td>
                    <td>
                      <span className={agent.growth >= 0 ? 'growth-positive' : 'growth-negative'}>
                        {agent.growth >= 0 ? '+' : ''}{agent.growth}%
                      </span>
                    </td>
                    <td>
                      <span 
                        className="performance-badge"
                        style={{ color: getPerformanceColor(agent.performance) }}
                      >
                        {agent.performance}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-edit">Edit</button>
                        <button className="btn-adjust">Adjust</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Target Trends */}
      {activeTab === 'trends' && (
        <div className="target-trends">
          <div className="trend-chart">
            <h3>Target vs Actual Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={targets.targetTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Actual"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="performance-insights">
            <h3>Performance Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Best Performer</h4>
                <div className="insight-value">Priya Sharma</div>
                <div className="insight-detail">152% Target Achievement</div>
              </div>
              <div className="insight-card">
                <h4>Most Improved</h4>
                <div className="insight-value">Ravi Kumar</div>
                <div className="insight-detail">+15.3% Growth</div>
              </div>
              <div className="insight-card">
                <h4>Needs Attention</h4>
                <div className="insight-value">3 Agents</div>
                <div className="insight-detail">Below target performance</div>
              </div>
              <div className="insight-card">
                <h4>Team Average</h4>
                <div className="insight-value">87.5%</div>
                <div className="insight-detail">Overall achievement rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Target Settings */}
      {activeTab === 'settings' && (
        <div className="target-settings">
          <div className="settings-card">
            <h3>Target Configuration</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Default Target Period</label>
                <select defaultValue="monthly">
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div className="form-group">
                <label>Auto-adjust Targets</label>
                <select defaultValue="enabled">
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
              <div className="form-group">
                <label>Performance Threshold</label>
                <input type="number" defaultValue="80" placeholder="Minimum achievement percentage" />
              </div>
              <div className="form-group">
                <label>Growth Target</label>
                <input type="number" defaultValue="10" placeholder="Expected growth percentage" />
              </div>
              <button className="btn-save">Save Settings</button>
            </div>
          </div>

          <div className="bulk-actions">
            <h3>Bulk Actions</h3>
            <div className="bulk-buttons">
              <button className="btn-bulk">Increase All Targets by 10%</button>
              <button className="btn-bulk">Reset to Default Targets</button>
              <button className="btn-bulk">Export Target Settings</button>
              <button className="btn-bulk">Import Target Settings</button>
            </div>
          </div>
        </div>
      )}

      {/* Set Target Modal */}
      {showSetTarget && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Set New Target</h2>
              <button onClick={() => setShowSetTarget(false)}>×</button>
            </div>
            <form onSubmit={handleSetTarget}>
              <div className="form-group">
                <label>Select Agent</label>
                <select
                  value={newTarget.agentId}
                  onChange={(e) => setNewTarget({...newTarget, agentId: e.target.value})}
                  required
                >
                  <option value="">Choose Agent</option>
                  {targets.individualTargets.map(agent => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Target Amount (₹)</label>
                <input
                  type="number"
                  value={newTarget.targetAmount}
                  onChange={(e) => setNewTarget({...newTarget, targetAmount: e.target.value})}
                  placeholder="Enter target amount"
                  required
                />
              </div>
              <div className="form-group">
                <label>Target Period</label>
                <select
                  value={newTarget.period}
                  onChange={(e) => setNewTarget({...newTarget, period: e.target.value})}
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={newTarget.startDate}
                    onChange={(e) => setNewTarget({...newTarget, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={newTarget.endDate}
                    onChange={(e) => setNewTarget({...newTarget, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSetTarget(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Set Target</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetSetting;