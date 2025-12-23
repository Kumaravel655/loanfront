import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import './AgentManagement.css';

const AgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddAgent, setShowAddAgent] = useState(false);
  const [showEditAgent, setShowEditAgent] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
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
    try {
      const agentsData = await loanService.getCollectionAgents().catch(() => []);
      
      const agentsWithPerformance = agentsData.map(agent => {
        return {
          id: agent.id,
          name: agent.first_name && agent.last_name ? `${agent.first_name} ${agent.last_name}` : agent.username,
          email: agent.email,
          phone: 'N/A', // Backend doesn't have phone field in CustomUser
          region: 'N/A', // Backend doesn't have region field in CustomUser
          status: agent.is_active ? 'active' : 'inactive',
          target: 100000, // Default target
          collected: 0, // Default collected
          performance: 'average',
          joinDate: agent.date_joined,
          lastActive: agent.last_login ? new Date(agent.last_login).toLocaleDateString() : 'Never'
        };
      });
      setAgents(agentsWithPerformance);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAgent = async (e) => {
    e.preventDefault();
    
    if (!newAgent.name || !newAgent.email) {
      alert('Please fill in name and email');
      return;
    }
    
    try {
      const nameParts = newAgent.name.trim().split(' ');
      const agentData = {
        username: newAgent.name.toLowerCase().replace(/\s+/g, ''),
        email: newAgent.email,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        role: 'collection_agent',
        password: 'defaultPassword123'
      };
      
      await loanService.createAgent(agentData);
      await fetchAgents();
      setShowAddAgent(false);
      setNewAgent({ name: '', email: '', phone: '', region: '', target: '' });
      alert('Agent added successfully!');
    } catch (error) {
      console.error('Error adding agent:', error);
      alert('Failed to add agent: ' + error.message);
    }
  };

  const handleEditAgent = (agent) => {
    setSelectedAgent(agent);
    setNewAgent({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      region: agent.region,
      target: agent.target.toString()
    });
    setShowEditAgent(true);
  };

  const handleViewDetails = (agent) => {
    setSelectedAgent(agent);
    setShowViewDetails(true);
  };

  const handleUpdateAgent = async (e) => {
    e.preventDefault();
    try {
      const nameParts = newAgent.name.trim().split(' ');
      const updateData = {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        email: newAgent.email
      };
      
      const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${selectedAgent.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        await fetchAgents();
        setShowEditAgent(false);
        setSelectedAgent(null);
        setNewAgent({ name: '', email: '', phone: '', region: '', target: '' });
        alert('Agent updated successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to update agent: ' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Failed to update agent: ' + error.message);
    }
  };
  const toggleAgentStatus = async (agentId) => {
    try {
      const agent = agents.find(a => a.id === agentId);
      const newStatus = agent.status === 'active' ? false : true;
      
      const response = await fetch(`http://127.0.0.1:8000/api/auth/users/${agentId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      
      if (response.ok) {
        setAgents(agents.map(agent => 
          agent.id === agentId 
            ? { ...agent, status: newStatus ? 'active' : 'inactive' }
            : agent
        ));
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
    }
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
          onClick={() => {
            console.log('Add New Agent button clicked, current showAddAgent:', showAddAgent);
            setShowAddAgent(true);
            console.log('showAddAgent set to true');
          }}
          type="button"
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
              <button 
                className="btn-secondary"
                onClick={() => handleEditAgent(agent)}
              >
                Edit
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleViewDetails(agent)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>



      {/* Edit Agent Modal */}
      {showEditAgent && selectedAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)'
        }} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowEditAgent(false);
            setSelectedAgent(null);
          }
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600'}}>Edit Agent</h2>
                <p style={{margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px'}}>Update agent information</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowEditAgent(false);
                  setSelectedAgent(null);
                }} 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >×</button>
            </div>
            
            <form onSubmit={handleUpdateAgent} style={{padding: '24px'}}>
              <div style={{display: 'grid', gap: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>Full Name</label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>Email</label>
                    <input
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>Phone</label>
                    <input
                      type="tel"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>Region</label>
                  <select
                    value={newAgent.region}
                    onChange={(e) => setNewAgent({...newAgent, region: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white'
                    }}
                    required
                  >
                    <option value="Central Zone">Central Zone</option>
                    <option value="South Zone">South Zone</option>
                    <option value="North Zone">North Zone</option>
                    <option value="West Zone">West Zone</option>
                    <option value="East Zone">East Zone</option>
                  </select>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowEditAgent(false);
                    setSelectedAgent(null);
                  }} 
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white'
                  }}
                >
                  Update Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewDetails && selectedAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)'
        }} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowViewDetails(false);
            setSelectedAgent(null);
          }
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600'}}>Agent Details</h2>
                <p style={{margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px'}}>{selectedAgent.name}</p>
              </div>
              <button 
                type="button" 
                onClick={() => {
                  setShowViewDetails(false);
                  setSelectedAgent(null);
                }} 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >×</button>
            </div>
            
            <div style={{padding: '24px'}}>
              <div style={{display: 'grid', gap: '20px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div style={{padding: '16px', background: '#f8fafc', borderRadius: '12px'}}>
                    <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Personal Information</h4>
                    <div style={{display: 'grid', gap: '8px'}}>
                      <div><strong>Name:</strong> {selectedAgent.name}</div>
                      <div><strong>Email:</strong> {selectedAgent.email}</div>
                      <div><strong>Phone:</strong> {selectedAgent.phone}</div>
                      <div><strong>Region:</strong> {selectedAgent.region}</div>
                    </div>
                  </div>
                  
                  <div style={{padding: '16px', background: '#f0fdf4', borderRadius: '12px'}}>
                    <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Performance</h4>
                    <div style={{display: 'grid', gap: '8px'}}>
                      <div><strong>Target:</strong> ₹{selectedAgent.target.toLocaleString()}</div>
                      <div><strong>Collected:</strong> ₹{selectedAgent.collected.toLocaleString()}</div>
                      <div><strong>Achievement:</strong> {calculateAchievement(selectedAgent.collected, selectedAgent.target)}%</div>
                      <div><strong>Performance:</strong> <span style={{color: getPerformanceColor(selectedAgent.performance), fontWeight: 'bold', textTransform: 'capitalize'}}>{selectedAgent.performance}</span></div>
                    </div>
                  </div>
                </div>
                
                <div style={{padding: '16px', background: '#fef3c7', borderRadius: '12px'}}>
                  <h4 style={{margin: '0 0 8px 0', color: '#374151'}}>Activity Information</h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px'}}>
                    <div><strong>Status:</strong> <span style={{color: selectedAgent.status === 'active' ? '#10b981' : '#ef4444', fontWeight: 'bold', textTransform: 'capitalize'}}>{selectedAgent.status}</span></div>
                    <div><strong>Join Date:</strong> {new Date(selectedAgent.joinDate).toLocaleDateString()}</div>
                    <div><strong>Last Active:</strong> {selectedAgent.lastActive}</div>
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button 
                  onClick={() => {
                    setShowViewDetails(false);
                    handleEditAgent(selectedAgent);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white'
                  }}
                >
                  Edit Agent
                </button>
                <button 
                  onClick={() => {
                    setShowViewDetails(false);
                    setSelectedAgent(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          backdropFilter: 'blur(5px)'
        }} onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowAddAgent(false);
          }
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600'}}>Add New Agent</h2>
                <p style={{margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px'}}>Create a new collection agent profile</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddAgent(false)} 
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >×</button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleAddAgent} style={{padding: '24px'}}>
              <div style={{display: 'grid', gap: '20px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>👤 Full Name</label>
                  <input
                    type="text"
                    value={newAgent.name}
                    onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>📧 Email</label>
                    <input
                      type="email"
                      value={newAgent.email}
                      onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      placeholder="agent@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>📞 Phone</label>
                    <input
                      type="tel"
                      value={newAgent.phone}
                      onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>🗺️ Region</label>
                    <select
                      value={newAgent.region}
                      onChange={(e) => setNewAgent({...newAgent, region: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        backgroundColor: 'white'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
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
                  <div>
                    <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151', fontSize: '14px'}}>🎯 Monthly Target</label>
                    <input
                      type="number"
                      value={newAgent.target}
                      onChange={(e) => setNewAgent({...newAgent, target: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      placeholder="100000"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddAgent(false)} 
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.borderColor = '#e5e7eb';
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                >
                  ✨ Add Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;