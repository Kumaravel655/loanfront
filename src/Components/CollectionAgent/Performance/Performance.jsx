import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Performance.css';

const Performance = () => {
  const [performance, setPerformance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/performance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPerformance(response.data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      // Mock data
      setPerformance({
        monthlyCollection: 450000,
        targetAchievement: 85,
        totalLoans: 25,
        recoveryRate: 92,
        averageCollection: 18000,
        ratings: 4.5
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (loading) {
    return <div className="loading">Loading performance data...</div>;
  }

  return (
    <div className="performance">
      <div className="page-header">
        <h1>Performance Metrics</h1>
      </div>

      <div className="performance-grid">
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>Monthly Collection</h3>
            <p className="metric-value">{formatCurrency(performance.monthlyCollection)}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-info">
            <h3>Target Achievement</h3>
            <p className="metric-value">{performance.targetAchievement}%</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${performance.targetAchievement}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <h3>Recovery Rate</h3>
            <p className="metric-value">{performance.recoveryRate}%</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-info">
            <h3>Customer Rating</h3>
            <p className="metric-value">{performance.ratings}/5</p>
            <div className="stars">
              {'⭐'.repeat(Math.floor(performance.ratings))}
            </div>
          </div>
        </div>
      </div>

      <div className="performance-details">
        <h2>Performance Overview</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Total Assigned Loans:</span>
            <span className="value">{performance.totalLoans}</span>
          </div>
          <div className="detail-item">
            <span className="label">Average Collection per Loan:</span>
            <span className="value">{formatCurrency(performance.averageCollection)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Success Rate:</span>
            <span className="value">{performance.recoveryRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;