import React from 'react';
import Card from '../../../../components/common/Card/Card';
import styles from './RecentActivities.module.css';

const RecentActivities = () => {
  // Data from GET /api/dashboard/recent-activities/
  const activities = [
    { id: 1, type: 'application', text: 'New loan application from John Doe.', time: '2 hours ago' },
    { id: 2, type: 'repayment', text: 'Payment of $500 received from Jane Smith.', time: '5 hours ago' },
    { id: 3, type: 'disbursement', text: 'Loan of $10,000 disbursed to Peter Jones.', time: '1 day ago' },
    { id: 4, type: 'approval', text: 'Loan application for Sarah Lee was approved.', time: '2 days ago' },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'application': return '📝';
      case 'repayment': return '💰';
      case 'disbursement': return '💸';
      case 'approval': return '✅';
      default: return '🔔';
    }
  };

  return (
    <Card>
      <h3 className={styles.title}>Recent Activities</h3>
      <ul className={styles.activityList}>
        {activities.map((activity) => (
          <li key={activity.id} className={styles.activityItem}>
            <div className={styles.icon}>{getIcon(activity.type)}</div>
            <div className={styles.details}>
              <p className={styles.text}>{activity.text}</p>
              <p className={styles.time}>{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default RecentActivities;