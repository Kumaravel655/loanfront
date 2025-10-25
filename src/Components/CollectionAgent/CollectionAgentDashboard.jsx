import React, { useState } from 'react';
import styles from './CollectionAgentDashboard.module.css';
import { Link } from 'react-router-dom';

const CollectionAgentDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
   const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };


  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <div className={styles.logo}>LMS Agent</div>
        <ul className={styles.navList}>
          <li><Link to="#" className={styles.navItem}>🏠 Dashboard</Link></li>
          <li><Link to="#" className={styles.navItem}>📋 Assigned Loans</Link></li>
          <li><Link to="#" className={styles.navItem}>💰 Today’s Collection</Link></li>
          <li><Link to="#" className={styles.navItem}>📜 Collection History</Link></li>
          <li><Link to="#" className={styles.navItem}>⏰ Pending/Overdue</Link></li>
          <li><Link to="#" className={styles.navItem}>📈 Performance</Link></li>
          <li><Link to="#" className={styles.navItem}>🔔 Notifications</Link></li>
          <li><Link to="#" className={styles.navItem}>⚙️ Quick Actions</Link></li>
          <li><Link to="/login" className={styles.navItem}>👤 Profile / Logout</Link></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={toggleSidebar}>
            ☰
          </button>
          <h1 className={styles.title}>Collection Agent Dashboard</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </header>

        {/* Summary Section */}
        <section className={styles.summaryGrid}>
          <div className={styles.card}>
            <h3>Total Collected Today</h3>
            <p>₹12,450</p>
          </div>
          <div className={styles.card}>
            <h3>Pending Dues</h3>
            <p>₹4,300</p>
          </div>
          <div className={styles.card}>
            <h3>Overdue Loans</h3>
            <p>5 Accounts</p>
          </div>
        </section>

        {/* Assigned Loans */}
        <section className={styles.section}>
          <h2>Assigned Loans / Due List</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Due Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ravi Kumar</td>
                <td>₹1,200</td>
                <td>24 Oct 2025</td>
                <td>Pending</td>
                <td>UPI</td>
              </tr>
              <tr>
                <td>Meena Devi</td>
                <td>₹850</td>
                <td>23 Oct 2025</td>
                <td>Collected</td>
                <td>Cash</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default CollectionAgentDashboard;
