import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { FaChartBar, FaTrophy, FaCheckCircle, FaCalendarAlt, FaStar } from 'react-icons/fa';
import './Performance.css';

const Performance = () => {
  const [performance, setPerformance] = useState({
    totalCollected: 0,
    collectionRate: 0,
    totalAssigned: 0,
    completed: 0,
    monthlyTarget: 1000000,
    targetAchievement: 0,
    rating: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const schedules = await loanService.getLoanSchedules();
      
      const userSchedules = schedules.filter(s => s.assigned_to === user?.id);
      const completed = userSchedules.filter(s => s.status === 'done');
      const totalCollected = completed.reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      const collectionRate = userSchedules.length > 0 
        ? Math.round((completed.length / userSchedules.length) * 100) 
        : 0;
      
      const monthlyTarget = 1000000;
      const targetAchievement = Math.round((totalCollected / monthlyTarget) * 100);
      
      const rating = collectionRate >= 90 ? 5 : 
                     collectionRate >= 75 ? 4 : 
                     collectionRate >= 60 ? 3 : 
                     collectionRate >= 40 ? 2 : 1;
      
      setPerformance({
        totalCollected,
        collectionRate,
        totalAssigned: userSchedules.length,
        completed: completed.length,
        monthlyTarget,
        targetAchievement,
        rating
      });
    } catch (error) {
      console.error('Error fetching performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="performance">
        <div className="loading">Loading performance metrics...</div>
      </div>
    );
  }

  return (
    <div className="performance">
      <div className="page-header">
        <h1><FaChartBar /> Performance Metrics</h1>
        <p>Track your collection performance and targets</p>
      </div>
      
      <div className="performance-grid">
        <div className="metric-card">
          <div className="metric-icon"><FaTrophy /></div>
          <div className="metric-info">
            <h3>Total Collected</h3>
            <p className="metric-value">{formatCurrency(performance.totalCollected)}</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><FaCheckCircle /></div>
          <div className="metric-info">
            <h3>Collection Rate</h3>
            <p className="metric-value">{performance.collectionRate}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${performance.collectionRate}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><FaCalendarAlt /></div>
          <div className="metric-info">
            <h3>Target Achievement</h3>
            <p className="metric-value">{performance.targetAchievement}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{width: `${Math.min(performance.targetAchievement, 100)}%`}}></div>
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon"><FaStar /></div>
          <div className="metric-info">
            <h3>Performance Rating</h3>
            <p className="metric-value">{performance.rating}/5</p>
            <div className="stars">
              {'★'.repeat(performance.rating)}{'☆'.repeat(5 - performance.rating)}
            </div>
          </div>
        </div>
      </div>

      <div className="performance-details">
        <h2>Detailed Metrics</h2>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Total Assigned:</span>
            <span className="value">{performance.totalAssigned}</span>
          </div>
          <div className="detail-item">
            <span className="label">Completed:</span>
            <span className="value">{performance.completed}</span>
          </div>
          <div className="detail-item">
            <span className="label">Pending:</span>
            <span className="value">{performance.totalAssigned - performance.completed}</span>
          </div>
          <div className="detail-item">
            <span className="label">Monthly Target:</span>
            <span className="value">{formatCurrency(performance.monthlyTarget)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Remaining:</span>
            <span className="value">{formatCurrency(Math.max(0, performance.monthlyTarget - performance.totalCollected))}</span>
          </div>
          <div className="detail-item">
            <span className="label">Success Rate:</span>
            <span className="value">{performance.collectionRate}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;