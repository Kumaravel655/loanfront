// src/components/Agent/CollectPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CollectPage = () => {
  const { loanId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = "http://127.0.0.1:8000/api/auth";

  const [loanSchedules, setLoanSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🧾 Fetch all schedules for this loan
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/loan-schedules/`, {
          headers: { Authorization: `Token ${token}` },
        });

        // Filter schedules for this specific loan
        const schedules = response.data.filter(
          (s) => String(s.loan) === String(loanId)
        );
        setLoanSchedules(schedules);
      } catch (err) {
        console.error("Error fetching loan details:", err);
        setMessage("⚠️ Failed to load loan details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [loanId, token]);

  const handleCollect = async () => {
    if (!selectedSchedule) {
      alert("Please select a schedule to collect payment for.");
      return;
    }
    if (!paidAmount) {
      alert("Please enter the paid amount.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/loan-schedules/${selectedSchedule}/collect/`,
        {
          payment_method: paymentMethod,
          paid_amount: paidAmount,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message || "✅ Payment collected successfully!");
      setPaidAmount("");
    } catch (err) {
      console.error("Payment collection failed:", err);
      setMessage("❌ Failed to collect payment.");
    }
  };

  if (loading) return <p>Loading loan details...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white">
          <h5>Loan #{loanId} - Collection Page</h5>
        </div>
        <div className="card-body">
          {message && (
            <div className="alert alert-info text-center">{message}</div>
          )}

          <div className="mb-4">
            <label className="form-label fw-semibold">Select Schedule:</label>
            <select
              className="form-select"
              value={selectedSchedule || ""}
              onChange={(e) => setSelectedSchedule(e.target.value)}
            >
              <option value="">-- Select an Installment --</option>
              {loanSchedules.map((s) => (
                <option key={s.id} value={s.id}>
                  Installment #{s.installment_no} — ₹{s.total_due} due on{" "}
                  {new Date(s.due_date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {selectedSchedule && (
            <>
              <div className="mb-3">
                <label className="form-label">Payment Method:</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Paid Amount (₹):</label>
                <input
                  type="number"
                  className="form-control"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>

              <button className="btn btn-success" onClick={handleCollect}>
                Collect Payment
              </button>
            </>
          )}

          <button
            className="btn btn-secondary mt-3 ms-2"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Loan schedule table */}
      <div className="card mt-4 shadow-sm">
        <div className="card-header bg-light fw-semibold">All Dues</div>
        <div className="card-body">
          <table className="table table-bordered table-hover text-center">
            <thead>
              <tr>
                <th>Installment</th>
                <th>Due Date</th>
                <th>Total Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loanSchedules.map((s) => (
                <tr key={s.id}>
                  <td>{s.installment_no}</td>
                  <td>{new Date(s.due_date).toLocaleDateString()}</td>
                  <td>₹{s.total_due}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "done"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {s.status || "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CollectPage;
