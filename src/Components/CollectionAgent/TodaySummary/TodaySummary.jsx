import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TodaySummary.css';

const TodaySummary = () => {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySummary();
  }, []);

  const fetchTodaySummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/collection-agent/today-summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching today summary:', error);
      // Mock data
      setSummary({
        totalCollection: 75000,
        totalVisits: 12,
        successfulCollections: 8,
        pendingCollections: 4,
        averageCollection: 9375,
        collections: [
          { customerName: 'Rahul Sharma', amount: 15000, time: '10:30 AM', status: 'Success' },
          { customerName: 'Priya Patel', amount: 12000, time: '11:15 AM', status: 'Success' }
        ]
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
    return <div className="loading">Loading today's summary...</div>;
  }

  return (
    <div className="today-summary">
      <div className="page-header">
        <h1>Today's Collection Summary</h1>
        <div className="date-display">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Collection</h3>
            <p className="stat-number">{formatCurrency(summary.totalCollection)}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Visits</h3>
            <p className="stat-number">{summary.totalVisits}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Successful</h3>
            <p className="stat-number">{summary.successfulCollections}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending</h3>
            <p className="stat-number">{summary.pendingCollections}</p>
          </div>
        </div>
      </div>

      <div className="collections-list">
        <h2>Today's Collections</h2>
        {summary.collections && summary.collections.length > 0 ? (
          <div className="table-container">
            <table className="collections-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {summary.collections.map((collection, index) => (
                  <tr key={index}>
                    <td>{collection.customerName}</td>
                    <td className="amount">{formatCurrency(collection.amount)}</td>
                    <td>{collection.time}</td>
                    <td>
                      <span className={`status-badge ${collection.status.toLowerCase()}`}>
                        {collection.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No collections recorded today</div>
        )}
      </div>
    </div>
  );
};

export default TodaySummary;