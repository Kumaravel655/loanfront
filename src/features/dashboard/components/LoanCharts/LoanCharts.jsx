import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Card from '../../../../components/common/Card/Card'; // Corrected Path
import styles from './LoanCharts.module.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const LoanCharts = () => {
  // Data from GET /api/dashboard/loans-by-type/
  const pieData = {
    labels: ['Personal', 'Business', 'Mortgage'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623'],
    }],
  };

  // Data from GET /api/dashboard/loans-by-status/
  const barData = {
    labels: ['Pending', 'Approved', 'Rejected', 'Overdue'],
    datasets: [{
      label: 'Loan Count',
      data: [35, 840, 120, 12],
      backgroundColor: '#4A90E2',
    }],
  };

  return (
    <div className={styles.chartsGrid}>
      <Card>
        <h3 className={styles.chartTitle}>Loans by Type</h3>
        <Pie data={pieData} />
      </Card>
      <Card>
        <h3 className={styles.chartTitle}>Loans by Status</h3>
        <Bar data={barData} />
      </Card>
    </div>
  );
};

export default LoanCharts;