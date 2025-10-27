import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "./StatusBadge";

const RepaymentListTable = () => {
  const [repayments, setRepayments] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const BASE_URL = "http://127.0.0.1:8000/api/auth";

  // ✅ Fetch loan schedules & agents together
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesRes, agentsRes] = await Promise.all([
          axios.get(`${BASE_URL}/loan-schedules/`, {
            headers: { Authorization: `Token ${token}` },
          }),
          axios.get(`${BASE_URL}/agents/`, {
            headers: { Authorization: `Token ${token}` },
          }),
        ]);

        setRepayments(schedulesRes.data);
        setAgents(agentsRes.data);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load loan schedules or agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // ✅ Assign API using POST /loan-schedules/{id}/assign/
  const handleAssign = async (scheduleId, agentId) => {
    if (!agentId) {
      alert("⚠️ Please select an agent before assigning.");
      return;
    }

    setAssigning(scheduleId);
    try {
      await axios.post(
        `${BASE_URL}/loan-schedules/${scheduleId}/assign/`,
        { assigned_to: agentId },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update assigned agent locally
      setRepayments((prev) =>
        prev.map((item) =>
          item.id === scheduleId ? { ...item, assigned_to: parseInt(agentId) } : item
        )
      );

      alert("✅ Loan schedule successfully assigned!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign loan schedule.");
    } finally {
      setAssigning(null);
    }
  };

  if (loading) return <p>Loading repayment schedules...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary text-white fw-semibold">
        Loan Schedule Assignment
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
              <th>Assigned To</th>
              <th>Status</th>
              <th>Assign Agent</th>
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
                <td>
                  {row.assigned_to
                    ? agents.find((a) => a.id === row.assigned_to)?.username || "Unknown"
                    : "Not Assigned"}
                </td>
                <td>
                  <StatusBadge status={row.status || "Pending"} />
                </td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    style={{ width: "140px" }}
                    defaultValue=""
                    onChange={(e) => handleAssign(row.id, e.target.value)}
                    disabled={assigning === row.id}
                  >
                    <option value="">Select Agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.username}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RepaymentListTable;
