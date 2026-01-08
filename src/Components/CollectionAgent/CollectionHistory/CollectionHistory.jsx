import React, { useState, useEffect } from 'react';
import { loanService } from '../../../services/loanService';
import { FaHistory, FaCalendarAlt, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import PageBanner from '../shared/PageBanner';
import './CollectionHistory.css';

const CollectionHistory = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, count: 0 });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchCollectionHistory();
  }, []);

  const fetchCollectionHistory = async () => {
    try {
      const [schedules, dailyCollections] = await Promise.all([
        loanService.getLoanSchedules(),
        loanService.getDailyCollections()
      ]);
      
      const userCollections = schedules.filter(s => 
        s.assigned_to === user?.id && s.status === 'done'
      );
      
      const totalAmount = userCollections.reduce((sum, c) => sum + parseFloat(c.total_due || 0), 0);
      const thisMonth = userCollections.filter(c => 
        new Date(c.due_date).getMonth() === new Date().getMonth()
      ).reduce((sum, c) => sum + parseFloat(c.total_due || 0), 0);
      
      setCollections(userCollections);
      setStats({ total: totalAmount, thisMonth, count: userCollections.length });
    } catch (error) {
      console.error('Error fetching collection history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="collection-history">
        <div className="loading">Loading collection history...</div>
      </div>
    );
  }

  return (
    <div className="collection-history">
      <PageBanner 
        icon={FaHistory}
        title="Collection History"
        subtitle="View your past collection records and performance"
        stats={[
          { value: formatCurrency(stats.total), label: 'Total Collections' },
          { value: stats.count, label: 'Total Count' }
        ]}
      />
      
      <div className="history-stats">
        <div className="stat-card">
          <FaDollarSign style={{fontSize: '2rem', color: '#10b981'}} />
          <h3>Total Collections</h3>
          <p className="stat-number">{formatCurrency(stats.total)}</p>
        </div>
        <div className="stat-card">
          <FaCalendarAlt style={{fontSize: '2rem', color: '#3b82f6'}} />
          <h3>This Month</h3>
          <p className="stat-number">{formatCurrency(stats.thisMonth)}</p>
        </div>
        <div className="stat-card">
          <FaCheckCircle style={{fontSize: '2rem', color: '#8b5cf6'}} />
          <h3>Total Count</h3>
          <p className="stat-number">{stats.count}</p>
        </div>
      </div>

      <div className="history-table-container">
        {collections.length === 0 ? (
          <div className="no-data">No collection history found</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Loan ID</th>
                <th>Installment</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((collection) => (
                <tr key={collection.id}>
                  <td>{new Date(collection.due_date).toLocaleDateString()}</td>
                  <td>#{collection.loan}</td>
                  <td>{collection.installment_no}</td>
                  <td>{formatCurrency(collection.total_due)}</td>
                  <td><span className="payment-method">Collected</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CollectionHistory;