import React, { useEffect, useState } from "react";
import axios from "axios";
 
const PendingDuesList = () => {
  const [pendingDues, setPendingDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPendingDues = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/loan-schedules/", {
          headers: { Authorization: `Token ${token}` },
        });

        // Filter pending or due statuses
        const filtered = response.data.filter(
          (item) =>
            item.status?.toLowerCase() === "pending" ||
            item.status?.toLowerCase() === "due"
        );

        setPendingDues(filtered);
      } catch (err) {
        console.error("Error fetching pending dues:", err);
        setError("Failed to fetch pending dues.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDues();
  }, [token]);

  if (loading) return <p>Loading pending dues...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-danger text-white fw-semibold">
        Pending Dues List
      </div>
      <div className="card-body">
        {pendingDues.length === 0 ? (
          <p className="text-muted text-center">🎉 No pending dues found.</p>
        ) : (
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
              </tr>
            </thead>
            <tbody>
              {pendingDues.map((row) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingDuesList;
