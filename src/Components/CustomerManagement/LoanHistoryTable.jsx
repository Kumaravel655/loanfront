import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const LoanHistoryTable = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // Get the logged-in user's token

  useEffect(() => {
    const fetchLoans = async () => {
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/loans/", // Your loan API endpoint
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        setLoans(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch loan data");
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [token]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading loans...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-secondary text-white">Loan History</div>
      <div className="card-body">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Customer</th>
              <th>Loan Type</th>
              <th>Principal Amount</th>
              <th>Total Due Count</th>
              <th>Due Amount</th>
              <th>Interest %</th>
              <th>Repayment Mode</th>
              <th>Status</th>
              <th>Date Applied</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.loan_id}>
                <td>{loan.loan_id}</td>
                <td>{loan.customer?.full_name || "-"}</td>
                <td>{loan.loan_type?.name || "-"}</td>
                <td>{loan.principal_amount}</td>
                <td>{loan.total_due_count}</td>
                <td>{loan.due_amount}</td>
                <td>{loan.interest_percentage}</td>
                <td>{loan.repayment_mode}</td>
                <td>{loan.loan_status}</td>
                <td>{new Date(loan.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanHistoryTable;
