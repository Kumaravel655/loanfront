import React, { useState, useEffect } from 'react';
import './AgentManagement.css';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    target: ''
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    // Simulate API call
    setTimeout(() => {
      setAgents([
        {
          id: 1,
          name: 'Priya Sharma',
          email: 'priya@lms.com',
          phone: '9876543210',
          region: 'Central Zone',
          status: 'active',
          target: 150000,
          collected: 152000,
          performance: 'excellent',
          joinDate: '2024-01-15',
          lastActive: '2 hours ago'
        },
        {
          id: 2,
          name: 'Ravi Kumar',
          email: 'ravi@lms.com',
          phone: '9876543211',
          region: 'South Zone',
          status: 'active',
          target: 120000,
          collected: 124500,
          performance: 'good',
          joinDate: '2024-02-01',
          lastActive: '1 hour ago'
        },
        {
          id: 3,
          name: 'Rahul Dev',
          email: 'rahul@lms.com',
          phone: '9876543212',
          region: 'North Zone',
          status: 'inactive',
          target: 100000,
          collected: 62000,
          performance: 'poor',
          joinDate: '2024-01-20',
          lastActive: '3 days ago'
        },
        {
          id: 4,
          name: 'Meena Patel',
          email: 'meena@lms.com',
          phone: '9876543213',
          region: 'West Zone',
          status: 'active',
          target: 130000,
          collected: 98000,
          performance: 'average',
          joinDate: '2024-02-10',
          lastActive: '30 minutes ago'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAgent = (e) => {
    e.preventDefault();
    const agent = {
      id: agents.length + 1,
      ...newAgent,
      status: 'active',
      collected: 0,
      performance: 'average',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now'
    };
    setAgents([...agents, agent]);
    setShowAddAgent(false);
    setNewAgent({ name: '', email: '', phone: '', region: '', target: '' });
  };

  const toggleAgentStatus = (agentId) => {
    setAgents(agents.map(agent => 
      agent.id === agentId 
        ? { ...agent, status: agent.status === 'active' ? 'inactive' : 'active' }
        : agent
    ));
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'average': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const calculateAchievement = (collected, target) => {
    return ((collected / target) * 100).toFixed(1);
  };

  if (loading) {
    return <div className="loading">Loading agents...</div>;
  }

  return (
    <div className="agent-management">
      <div className="page-header">
        <div>
          <h1>Agent Management</h1>
          <p>Manage your collection agents and their performance</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowAddAgent(true)}
        >
          + Add New Agent
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search agents by name or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button 
            className={statusFilter === 'all' ? 'active' : ''}
            onClick={() => setStatusFilter('all')}
          >
            All Agents
          </button>
          <button 
            className={statusFilter === 'active' ? 'active' : ''}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button 
            className={statusFilter === 'inactive' ? 'active' : ''}
            onClick={() => setStatusFilter('inactive')}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="agents-grid">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                {agent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p>{agent.region}</p>
              </div>
              <div className={`status-badge ${agent.status}`}>
                {agent.status}
              </div>
            </div>

            <div className="agent-details">
              <div className="detail-item">
                <span>Email:</span>
                <span>{agent.email}</span>
              </div>
              <div className="detail-item">
                <span>Phone:</span>
                <span>{agent.phone}</span>
              </div>
              <div className="detail-item">
                <span>Join Date:</span>
                <span>{new Date(agent.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span>Last Active:</span>
                <span>{agent.lastActive}</span>
              </div>
            </div>

            <div className="performance-section">
              <div className="performance-metric">
                <span>Target: ₹{agent.target.toLocaleString()}</span>
                <span>Collected: ₹{agent.collected.toLocaleString()}</span>
              </div>
              <div className="achievement-bar">
                <div 
                  className="achievement-fill"
                  style={{ 
                    width: `${Math.min(100, calculateAchievement(agent.collected, agent.target))}%`,
                    backgroundColor: getPerformanceColor(agent.performance)
                  }}
                ></div>
                <span>{calculateAchievement(agent.collected, agent.target)}%</span>
              </div>
              <div className="performance-badge" style={{ color: getPerformanceColor(agent.performance) }}>
                {agent.performance}
              </div>
            </div>

            <div className="agent-actions">
              <button 
                className={`btn-status ${agent.status}`}
                onClick={() => toggleAgentStatus(agent.id)}
              >
                {agent.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              <button className="btn-secondary">Edit</button>
              <button className="btn-secondary">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agent Modal */}
      {showAddAgent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Agent</h2>
              <button onClick={() => setShowAddAgent(false)}>×</button>
            </div>
            <form onSubmit={handleAddAgent}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Region</label>
                <select
                  value={newAgent.region}
                  onChange={(e) => setNewAgent({...newAgent, region: e.target.value})}
                  required
                >
                  <option value="">Select Region</option>
                  <option value="Central Zone">Central Zone</option>
                  <option value="South Zone">South Zone</option>
                  <option value="North Zone">North Zone</option>
                  <option value="West Zone">West Zone</option>
                  <option value="East Zone">East Zone</option>
                </select>
              </div>
              <div className="form-group">
                <label>Monthly Target (₹)</label>
                <input
                  type="number"
                  value={newAgent.target}
                  onChange={(e) => setNewAgent({...newAgent, target: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddAgent(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Agent</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;