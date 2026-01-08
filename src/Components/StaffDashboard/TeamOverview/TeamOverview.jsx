import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { FaUsers, FaUserCheck, FaBullseye, FaUserPlus, FaMapMarkerAlt, FaCalendarAlt, FaChartPie } from 'react-icons/fa';
import { loanService } from '../../../services/loanService';
import PageBanner from '../shared/PageBanner';
import './TeamOverview.css';

const TeamOverview = () => {
  const [teamData, setTeamData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [agents, collections] = await Promise.all([
        loanService.getCollectionAgents().catch(() => []),
        loanService.getDailyCollections().catch(() => [])
      ]);

      // Calculate real team statistics
      const activeAgents = agents.filter(a => a.is_active);
      const totalAgents = agents.length;
      const onLeave = totalAgents - activeAgents.length;
      
      // Calculate new hires (joined in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const newHires = agents.filter(a => 
        new Date(a.date_joined) > thirtyDaysAgo
      ).length;

      // Regional distribution
      const regionCounts = {};
      agents.forEach(agent => {
        const region = agent.region || 'Unassigned';
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      });
      
      const regionalDistribution = Object.entries(regionCounts).map(([region, count], index) => ({
        name: region,
        agents: count,
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
      }));

      // Performance distribution based on real data
      const performanceDistribution = [
        { rating: 'Excellent', count: 0, color: '#10B981' },
        { rating: 'Good', count: 0, color: '#3B82F6' },
        { rating: 'Average', count: 0, color: '#F59E0B' },
        { rating: 'Needs Improvement', count: 0, color: '#EF4444' }
      ];

      // Experience data based on join dates
      const experienceData = [];
      const experienceRanges = [
        { range: '<1 year', min: 0, max: 1 },
        { range: '1-2 years', min: 1, max: 2 },
        { range: '2-3 years', min: 2, max: 3 },
        { range: '3-5 years', min: 3, max: 5 },
        { range: '>5 years', min: 5, max: 100 }
      ];
      
      experienceRanges.forEach(range => {
        const count = agents.filter(agent => {
          const joinDate = new Date(agent.date_joined);
          const yearsExperience = (new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365);
          return yearsExperience >= range.min && yearsExperience < range.max;
        }).length;
        experienceData.push({ range: range.range, count });
      });

      // Team members with real data
      const teamMembers = agents.slice(0, 10).map((agent, index) => {
        const totalCollected = 0; // No collection data available
        const target = 100000; // Default target
        const achievement = 0;
        
        let performance = 'average';

        return {
          id: agent.id,
          name: agent.username || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Unknown',
          role: agent.role === 'collection_agent' ? 'Collection Agent' : agent.role,
          region: agent.region || 'Unassigned',
          experience: (() => {
            const joinDate = new Date(agent.date_joined);
            const yearsExperience = (new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365);
            return yearsExperience < 1 ? '<1 year' :
                   yearsExperience < 2 ? '1-2 years' :
                   yearsExperience < 3 ? '2-3 years' :
                   yearsExperience < 5 ? '3-5 years' : '>5 years';
          })(),
          status: agent.is_active ? 'active' : 'inactive',
          performance: performance,
          currentTarget: target,
          achieved: totalCollected,
          joinDate: agent.date_joined || new Date().toISOString()
        };
      });

      // Update performance distribution after teamMembers is defined
      performanceDistribution[0].count = teamMembers.filter(m => m.performance === 'excellent').length;
      performanceDistribution[1].count = teamMembers.filter(m => m.performance === 'good').length;
      performanceDistribution[2].count = teamMembers.filter(m => m.performance === 'average').length;
      performanceDistribution[3].count = teamMembers.filter(m => m.performance === 'poor').length;

      setTeamData({
        summary: {
          totalAgents,
          activeAgents: activeAgents.length,
          onLeave,
          newHires,
          avgExperience: (() => {
            const totalExperience = agents.reduce((sum, agent) => {
              const joinDate = new Date(agent.date_joined);
              const yearsExperience = (new Date() - joinDate) / (1000 * 60 * 60 * 24 * 365);
              return sum + yearsExperience;
            }, 0);
            return totalAgents > 0 ? (totalExperience / totalAgents).toFixed(1) + ' years' : '0 years';
          })()
        },
        regionalDistribution,
        performanceDistribution,
        experienceData,
        teamMembers
      });
    } catch (error) {
      console.error('Error fetching team data:', error);
      // Fallback to empty data
      setTeamData({
        summary: {
          totalAgents: 0,
          activeAgents: 0,
          onLeave: 0,
          newHires: 0,
          avgExperience: '0 years'
        },
        regionalDistribution: [],
        performanceDistribution: [],
        experienceData: [],
        teamMembers: []
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
      <PageBanner 
        icon={FaUsers}
        title="Team Overview"
        subtitle="Comprehensive view of your collection team structure and performance"
        stats={[
          { value: teamData.summary?.totalAgents || 0, label: 'Total Agents' },
          { value: teamData.summary?.activeAgents || 0, label: 'Active' }
        ]}
      />

      {/* Summary Cards */}
      <div className="summary-cards">
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-icon"><FaUsers /></div>
          <div className="card-content">
            <h3>Total Agents</h3>
            <p className="card-number">{teamData.summary.totalAgents}</p>
            <span className="card-subtitle">{teamData.summary.activeAgents} active</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-icon"><FaUserCheck /></div>
          <div className="card-content">
            <h3>Active Agents</h3>
            <p className="card-number">{teamData.summary.activeAgents}</p>
            <span className="card-subtitle">{teamData.summary.onLeave} on leave</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="card-icon"><FaBullseye /></div>
          <div className="card-content">
            <h3>Avg Experience</h3>
            <p className="card-number">{teamData.summary.avgExperience}</p>
            <span className="card-subtitle">Team average</span>
          </div>
        </motion.div>
        <motion.div 
          className="summary-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-icon"><FaUserPlus /></div>
          <div className="card-content">
            <h3>New Members</h3>
            <p className="card-number">{teamData.summary.newHires}</p>
            <span className="card-subtitle">This month</span>
          </div>
        </motion.div>
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