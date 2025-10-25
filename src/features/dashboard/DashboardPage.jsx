import React from 'react';
import KPISummaryCards from './components/KPISummaryCards/KPISummaryCards';
import LoanCharts from './components/LoanCharts/LoanCharts';
import RecentActivities from './components/RecentActivities/RecentActivities';
import styles from './DashboardPage.module.css'; 

const DashboardPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.pageTitle}>Dashboard Overview</h1>
      
      <section className={styles.section}>
        <KPISummaryCards />
      </section>
      
      <section className={styles.section}>
        <LoanCharts />
      </section>
      
      <section className={styles.section}>
        <RecentActivities />
      </section>
    </div>
  );
};

export default DashboardPage;