import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './TeamOverview.css';

const TeamOverview = () => {
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    setTimeout(() => {
      setTeamData({
        summary: {
          totalAgents: 25,
          activeAgents: 18,
          onLeave: 3,
          newHires: 2,
          avgExperience: '2.3 years'
        },
        regionalDistribution: [
          { name: 'Central Zone', agents: 6, color: '#3B82F6' },
          { name: 'South Zone', agents: 5, color: '#10B981' },
          { name: 'North Zone', agents: 5, color: '#F59E0B' },
          { name: 'West Zone', agents: 4, color: '#EF4444' },
          { name: 'East Zone', agents: 5, color: '#8B5CF6' }
        ],
        performanceDistribution: [
          { rating: 'Excellent', count: 4, color: '#10B981' },
          { rating: 'Good', count: 8, color: '#3B82F6' },
          { rating: 'Average', count: 7, color: '#F59E0B' },
          { rating: 'Needs Improvement', count: 6, color: '#EF4444' }
        ],
        experienceData: [
          { range: '<1 year', count: 6 },
          { range: '1-2 years', count: 8 },
          { range: '2-3 years', count: 5 },
          { range: '3-5 years', count: 4 },
          { range: '>5 years', count: 2 }
        ],
        teamMembers: [
          {
            id: 1,
            name: 'Priya Sharma',
            role: 'Senior Collector',
            region: 'Central Zone',
            experience: '3.2 years',
            status: 'active',
            performance: 'excellent',
            currentTarget: 150000,
            achieved: 152000,
            joinDate: '2024-01-15'
          },
          {
            id: 2,
            name: 'Ravi Kumar',
            role: 'Collector',
            region: 'South Zone',
            experience: '2.1 years',
            status: 'active',
            performance: 'good',
            currentTarget: 120000,
            achieved: 124500,
            joinDate: '2024-02-01'
          },
          {
            id: 3,
            name: 'Meena Patel',
            role: 'Collector',
            region: 'West Zone',
            experience: '1.8 years',
            status: 'active',
            performance: 'average',
            currentTarget: 130000,
            achieved: 98000,
            joinDate: '2024-02-10'
          },
          {
            id: 4,
            name: 'Rahul Dev',
            role: 'Junior Collector',
            region: 'North Zone',
            experience: '0.8 years',
            status: 'inactive',
            performance: 'poor',
            currentTarget: 100000,
            achieved: 62000,
            joinDate: '2024-01-20'
          },
          {
            id: 5,
            name: 'Ankit Singh',
            role: 'Junior Collector',
            region: 'East Zone',
            experience: '0.5 years',
            status: 'active',
            performance: 'average',
            currentTarget: 80000,
            achieved: 45000,
            joinDate: '2024-03-01'
          }
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

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return '#10B981';
      case 'good': return '#3B82F6';
      case 'average': return '#F59E0B';
      case 'poor': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return <div className="loading">Loading team overview...</div>;
  }

  return (
    <div className="team-overview">
      <div className="page-header">
        <h1>Team Overview</h1>
        <p>Comprehensive view of your collection team structure and performance</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">👥</div>
          <div className="card-content">
            <h3>Total Agents</h3>
            <p className="card-number">{teamData.summary.totalAgents}</p>
            <span className="card-subtitle">{teamData.summary.activeAgents} active</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">✅</div>
          <div className="card-content">
            <h3>Active Agents</h3>
            <p className="card-number">{teamData.summary.activeAgents}</p>
            <span className="card-subtitle">{teamData.summary.onLeave} on leave</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Avg Experience</h3>
            <p className="card-number">{teamData.summary.avgExperience}</p>
            <span className="card-subtitle">Team average</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🆕</div>
          <div className="card-content">
            <h3>New Members</h3>
            <p className="card-number">{teamData.summary.newHires}</p>
            <span className="card-subtitle">This month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <h3>Regional Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={teamData.regionalDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="agents"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {teamData.regionalDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData.performanceDistribution}>
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {teamData.performanceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Experience Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamData.experienceData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="team-members-section">
        <h3>Team Members</h3>
        <div className="members-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Role</th>
                <th>Region</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Performance</th>
                <th>Target vs Actual</th>
                <th>Achievement</th>
              </tr>
            </thead>
            <tbody>
              {teamData.teamMembers.map(member => (
                <tr key={member.id}>
                  <td>
                    <div className="member-info">
                      <div className="member-avatar">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="member-name">{member.name}</div>
                        <div className="member-join-date">
                          Since {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{member.role}</td>
                  <td>{member.region}</td>
                  <td>{member.experience}</td>
                  <td>
                    <span className={`status-badge ${member.status}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <span 
                      className="performance-badge"
                      style={{ color: getPerformanceColor(member.performance) }}
                    >
                      {member.performance}
                    </span>
                  </td>
                  <td>
                    <div className="target-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min(100, (member.achieved / member.currentTarget) * 100)}%`,
                            backgroundColor: getPerformanceColor(member.performance)
                          }}
                        ></div>
                      </div>
                      <div className="progress-numbers">
                        <span>{formatCurrency(member.achieved)}</span>
                        <span> / {formatCurrency(member.currentTarget)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`achievement-rate ${
                      (member.achieved / member.currentTarget) >= 1 ? 'excellent' :
                      (member.achieved / member.currentTarget) >= 0.8 ? 'good' :
                      (member.achieved / member.currentTarget) >= 0.6 ? 'average' : 'poor'
                    }`}>
                      {((member.achieved / member.currentTarget) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-item">
          <h4>Team Capacity</h4>
          <div className="stat-value">85%</div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '85%', backgroundColor: '#3B82F6' }}></div>
            </div>
          </div>
        </div>
        <div className="stat-item">
          <h4>Average Achievement</h4>
          <div className="stat-value">87.5%</div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '87.5%', backgroundColor: '#10B981' }}></div>
            </div>
          </div>
        </div>
        <div className="stat-item">
          <h4>Training Required</h4>
          <div className="stat-value">6 agents</div>
          <div className="stat-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '24%', backgroundColor: '#F59E0B' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamOverview;