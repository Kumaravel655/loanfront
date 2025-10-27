import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./LoanDetail.css";

const LoanDetail = () => {
  const { id } = useParams(); // loan id from route
  const [loan, setLoan] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const BASE_URL = "http://127.0.0.1:8000/api/auth";

  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/loans/${id}/details/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setLoan(res.data.loan);
        setSchedules(res.data.schedules);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load loan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id, token]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(value || 0);

  if (loading) return <p>Loading loan details...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!loan) return <p>No loan found.</p>;

  return (
    <div className="loan-detail-page">
      <div className="header-section">
        <Link to="/agent/assigned-loans" className="back-btn">
          ← Back
        </Link>
        <h2>Loan #{loan.id} Details</h2>
      </div>

      {/* Loan Summary */}
      <div className="loan-summary card">
        <h4>Loan Information</h4>
        <div className="details-grid">
          <div>
            <strong>Customer:</strong> {loan.customer_name || "—"}
          </div>
          
          <div>
            <strong>Loan Amount:</strong> {formatCurrency(loan.loan_amount)}
          </div>
          <div>
            <strong>Interest Rate:</strong> {loan.interest_rate}%
          </div>
          <div>
            <strong>Duration:</strong> {loan.duration_months} months
          </div>
          <div>
            <strong>Status:</strong>{" "}
            <span className={`status ${loan.status?.toLowerCase()}`}>
              {loan.status}
            </span>
          </div>
        </div>
      </div>

      {/* Loan Schedules */}
      <div className="loan-dues card">
        <h4>Installment Schedule</h4>
        {schedules.length === 0 ? (
          <p>No dues found for this loan.</p>
        ) : (
          <table className="table table-bordered align-middle text-center">
            <thead>
              <tr>
                <th>Installment No</th>
                <th>Due Date</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Total Due</th>
                <th>Remaining Principal</th>
                <th>Status</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((item) => (
                <tr key={item.id}>
                  <td>{item.installment_no}</td>
                  <td>{new Date(item.due_date).toLocaleDateString()}</td>
                  <td>{formatCurrency(item.principal_amount)}</td>
                  <td>{formatCurrency(item.interest_amount)}</td>
                  <td>{formatCurrency(item.total_due)}</td>
                  <td>{formatCurrency(item.remaining_principal)}</td>
                  <td>{item.status || "Pending"}</td>
                  <td>{item.assigned_to || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LoanDetail;
