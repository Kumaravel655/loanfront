import React, { useEffect, useState } from "react";
import axios from "axios";
import EscalationNotesModal from "./EscalationNotesModal";
import StatusBadge from "./StatusBadge";

const RepaymentListTable = () => {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token"); // If API requires authentication

  useEffect(() => {
    const fetchRepayments = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/loan-schedules/", {
          headers: { Authorization: `Token ${token}` },
        });
        setRepayments(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch repayment schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepayments();
  }, [token]);

  if (loading) return <p>Loading repayment schedules...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary text-white fw-semibold">
        All Repayment Schedules
      </div>
      <div className="card-body">
        <table className="table table-hover table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Loan ID</th>
              <th>Installment No</th>
              <th>Due Date</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Total Due</th>
              <th>Remaining Principal</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {repayments.map((row) => (
              <tr key={row.id}>
                <td>{row.loan}</td>
                <td>{row.installment_no}</td>
                <td>{new Date(row.due_date).toLocaleDateString()}</td>
                <td>₹{row.principal_amount}</td>
                <td>₹{row.interest_amount}</td>
                <td>₹{row.total_due}</td>
                <td>₹{row.remaining_principal}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => setShowModal(true)}
                  >
                    Add Escalation
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && <EscalationNotesModal onClose={() => setShowModal(false)} />}
      </div>
    </div>
  );
};

export default RepaymentListTable;
