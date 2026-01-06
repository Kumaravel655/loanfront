import React from 'react';
import { FaFileAlt, FaSync, FaClock, FaExclamationTriangle } from 'react-icons/fa';
import Card from '../../../../components/common/Card/Card'; // Reusable Card component
import styles from './KPISummaryCards.module.css';

const KPISummaryCards = () => {
  // This data would typically come from an API call like GET /api/dashboard/summary/
  const stats = [
    { label: 'Total Loans', value: '1,250', icon: <FaFileAlt /> },
    { label: 'Active Loans', value: '840', icon: <FaSync /> },
    { label: 'Pending Approvals', value: '35', icon: <FaClock /> },
    { label: 'Overdue Loans', value: '12', icon: <FaExclamationTriangle /> },
  ];

  return (
    <div className={styles.cardsContainer}>
      {stats.map((stat) => (
        <Card key={stat.label} className={styles.kpiCard}>
          <div className={styles.iconWrapper}>{stat.icon}</div>
          <div className={styles.textWrapper}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.label}>{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default KPISummaryCards;