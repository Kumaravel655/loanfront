import React from "react";
import styles from "./StaffDashboard.module.css";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const StaffDashboard = () => {
  // Sample data for charts
  const agentCollectionData = [
    { name: "Ravi", amount: 12450 },
    { name: "Meena", amount: 9800 },
    { name: "Kumar", amount: 7400 },
    { name: "Priya", amount: 15200 },
    { name: "Rahul", amount: 6200 },
  ];

  const paymentModeData = [
    { name: "Cash", value: 45 },
    { name: "UPI", value: 35 },
    { name: "Card", value: 20 },
  ];

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B"];

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <header className={styles.header}>
        <h1>Staff Dashboard</h1>
        <div className={styles.navBtns}>
          <button>🏠 Home</button>
          <button>👥 Agents</button>
          <button>💰 Loans</button>
          <button>📊 Reports</button>
          <button>⚙️ Settings</button>
        </div>
      </header>

      {/* Top Metrics */}
      <section className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <h3>Total Collections Today</h3>
          <p>₹2,54,000</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Active Agents</h3>
          <p>18 / 25</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Top Collector</h3>
          <p>Priya Sharma</p>
        </div>
        <div className={styles.metricCard}>
          <h3>Delinquency Rate</h3>
          <p>8.5%</p>
        </div>
      </section>

      {/* Agents Overview */}
      <section className={styles.section}>
        <h2>Agents Overview</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Status</th>
              <th>Total Transactions</th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className={styles.avatar}>🧑‍💼</span> Ravi Kumar</td>
              <td><span className={styles.active}>Active</span></td>
              <td>42</td>
              <td>South Zone</td>
            </tr>
            <tr>
              <td><span className={styles.avatar}>👩‍💼</span> Priya Sharma</td>
              <td><span className={styles.active}>Active</span></td>
              <td>56</td>
              <td>Central Zone</td>
            </tr>
            <tr>
              <td><span className={styles.avatar}>🧔</span> Rahul Dev</td>
              <td><span className={styles.inactive}>Inactive</span></td>
              <td>23</td>
              <td>North Zone</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Charts Section */}
      <section className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <h2>Agent-wise Collections (₹)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentCollectionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h2>Repayment Mode Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentModeData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label
              >
                {paymentModeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Overdue Table */}
      <section className={styles.section}>
        <h2>Delinquency & Overdue Accounts</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Overdue Accounts</th>
              <th>Outstanding Amount</th>
              <th>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ravi Kumar</td>
              <td>3</td>
              <td>₹12,000</td>
              <td><span className={styles.warning}>⚠️ High</span></td>
            </tr>
            <tr>
              <td>Rahul Dev</td>
              <td>1</td>
              <td>₹3,200</td>
              <td><span className={styles.medium}>🟡 Medium</span></td>
            </tr>
            <tr>
              <td>Priya Sharma</td>
              <td>0</td>
              <td>—</td>
              <td><span className={styles.low}>🟢 Low</span></td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Export Section */}
      <section className={styles.exportSection}>
        <h2>Report Exports</h2>
        <div className={styles.exportBtns}>
          <button>⬇️ Export Agent Report (Excel)</button>
          <button>⬇️ Export Loan Report (PDF)</button>
          <button>⬇️ Attendance Report</button>
        </div>
      </section>
    </div>
  );
};

export default StaffDashboard;
