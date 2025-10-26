import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CollectionHistory.css';

const CollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    fetchCollectionHistory();
  }, [dateRange]);

  const fetchCollectionHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/collection-agent/collection-history?range=${dateRange}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collection history:', error);
      // Mock data
      setCollections([
        {
          id: 1,
          loanId: 'LN001',
          customerName: 'Rahul Sharma',
          amount: 15000,
          collectionDate: '2024-01-15',
          paymentMethod: 'Cash',
          status: 'Completed',
          collectedBy: 'You'
        },
        {
          id: 2,
          loanId: 'LN002',
          customerName: 'Priya Patel',
          amount: 12000,
          collectionDate: '2024-01-14',
          paymentMethod: 'UPI',
          status: 'Completed',
          collectedBy: 'You'
        }
      ]);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return <div className="loading">Loading collection history...</div>;
  }

  return (
    <div className="collection-history">
      <div className="page-header">
        <h1>Collection History</h1>
        <div className="header-actions">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <h3>Total Collections</h3>
          <p className="stat-number">{formatCurrency(collections.reduce((sum, item) => sum + item.amount, 0))}</p>
        </div>
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p className="stat-number">{collections.length}</p>
        </div>
      </div>

      <div className="collections-list">
        {collections.length === 0 ? (
          <div className="no-data">No collection history found</div>
        ) : (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Loan ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Collected By</th>
                </tr>
              </thead>
              <tbody>
                {collections.map(collection => (
                  <tr key={collection.id}>
                    <td>{formatDate(collection.collectionDate)}</td>
                    <td className="loan-id">#{collection.loanId}</td>
                    <td>{collection.customerName}</td>
                    <td className="amount">{formatCurrency(collection.amount)}</td>
                    <td>
                      <span className="payment-method">{collection.paymentMethod}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${collection.status.toLowerCase()}`}>
                        {collection.status}
                      </span>
                    </td>
                    <td>{collection.collectedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionHistory;