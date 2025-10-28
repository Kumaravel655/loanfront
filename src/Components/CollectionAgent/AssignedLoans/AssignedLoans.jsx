import React, { useEffect, useState } from "react";
import axios from "axios";
import StatusBadge from "../../RepaymentsCollections/StatusBadge";

const AssignedLoans = () => {
  const [assignedLoans, setAssignedLoans] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // ✅ Get logged-in user
  const BASE_URL = "http://127.0.0.1:8000/api/auth";

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

        const allSchedules = schedulesRes.data;
        const allAgents = agentsRes.data;

        // ✅ Find the logged-in agent record
        const currentAgent = allAgents.find(
          (a) => a.username === user?.username
        );

        // ✅ Filter only schedules assigned to this agent
        const userAssignedLoans = allSchedules.filter(
          (loan) => loan.assigned_to === currentAgent?.id
        );

        setAssignedLoans(userAssignedLoans);
        setAgents(allAgents);
      } catch (err) {
        console.error(err);
        setError("⚠️ Failed to load assigned loan schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.username]);

  if (loading) return <p>Loading assigned loan schedules...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (assignedLoans.length === 0)
    return <p>No loan schedules have been assigned to you.</p>;

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-success text-white fw-semibold">
        Your Assigned Loan Schedules
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
              <th>loan details</th>
              <th>collect</th>
            </tr>
          </thead>
          <tbody>
            {assignedLoans.map((row) => (
              <tr key={row.id}>
                <td>{row.loan}</td>
                <td>{row.installment_no}</td>
                <td>{new Date(row.due_date).toLocaleDateString()}</td>
                <td>₹{row.principal_amount}</td>
                <td>₹{row.interest_amount}</td>
                <td>₹{row.total_due}</td>
                <td>{user.username}</td>
                <td>
                  <StatusBadge status={row.status || "Pending"} />
                </td>
                <td>
                  <a
                    href={`/agent/loan/${row.loan}`}
                    className="btn btn-sm btn-primary"
                  >
                    View Details
                  </a>
                </td>
                <td>
                  <a
                    href={`/agent/collect/${row.loan}`}
                    className="btn btn-sm btn-success"
                  >
                    Collect
                  </a>
                </td>


            
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssignedLoans;
