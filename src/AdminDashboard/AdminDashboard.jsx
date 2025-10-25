import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar/Sidebar";
import Navbar from "../components/layout/Navbar/Navbar";

import LoanApplicationsPage from "../features/loanApplications/LoanApplicationsPage";
import CustomerManagement from "../Pages/CustomerManagement";
import RepaymentsCollectionsPage from "../Pages/RepaymentsCollectionsPage";
import DisbursementTransactionsPage from "../Pagess/Disbursements";
import RolesPermissionsPage from "../Pagess/RolesPermissionsPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "./AdminDashboard.css";

// Dashboard data example
const dashboardData = {
  total_loans: 1285,
  recovered_today: "₹ 1,24,000",
  not_recovered_today: "₹ 56,800",
  total_customers: 740,
  total_agents: 32,
  overdue_loans: 145,
  monthly_collection_graph: [
    { month: "Jan", amount: 580000 },
    { month: "Feb", amount: 620000 },
    { month: "Mar", amount: 700000 },
    { month: "Apr", amount: 560000 },
    { month: "May", amount: 750000 },
    { month: "Jun", amount: 690000 },
  ],
};

// Placeholder for under-construction pages
const PlaceholderPage = ({ title }) => (
  <div style={{ padding: "2rem" }}>
    <h1>{title}</h1>
    <p>This page is under construction.</p>
  </div>
);

// Dashboard Overview Component
const DashboardOverview = () => (
  <div className="dashboard-overview">
    <h2 className="dashboard-title">Admin Dashboard</h2>
    <div className="metrics-grid">
      <div className="metric-card">
        <h4>Total Loans</h4>
        <p>{dashboardData.total_loans}</p>
      </div>
      <div className="metric-card">
        <h4>Recovered Today</h4>
        <p>{dashboardData.recovered_today}</p>
      </div>
      <div className="metric-card">
        <h4>Not Recovered Today</h4>
        <p>{dashboardData.not_recovered_today}</p>
      </div>
      <div className="metric-card">
        <h4>Total Customers</h4>
        <p>{dashboardData.total_customers}</p>
      </div>
      <div className="metric-card">
        <h4>Total Agents</h4>
        <p>{dashboardData.total_agents}</p>
      </div>
      <div className="metric-card">
        <h4>Overdue Loans</h4>
        <p>{dashboardData.overdue_loans}</p>
      </div>
    </div>

    <div className="chart-section">
      <h3>Monthly Collection Trend</h3>
      <div className="chart-placeholder">
        {dashboardData.monthly_collection_graph.map((item) => (
          <div key={item.month} className="chart-bar">
            <div
              className="bar"
              style={{ height: `${item.amount / 10000}px` }}
              title={`${item.month}: ₹${item.amount.toLocaleString()}`}
            ></div>
            <span>{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="dashboard-main">
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="dashboard-content">
          <div className="container-fluid py-4">
            <Routes>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/loan-applications" element={<LoanApplicationsPage />} />
              <Route path="/customers" element={<CustomerManagement />} />
              <Route path="/repayments" element={<RepaymentsCollectionsPage />} />
              <Route path="/disbursements" element={<DisbursementTransactionsPage />} />
              <Route path="/roles" element={<RolesPermissionsPage />} />
              <Route path="/agents" element={<PlaceholderPage title="Agents Management" />} />
              <Route path="/reports" element={<PlaceholderPage title="Reports & Analytics" />} />
              <Route path="/workflow" element={<PlaceholderPage title="Workflow & Automation" />} />
              <Route path="*" element={<PlaceholderPage title="404: Page Not Found" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
