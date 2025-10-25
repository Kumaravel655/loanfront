import React, { useState } from "react";

const ManualPaymentEntryForm = () => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return alert("Please enter an amount");
    alert(`Manual payment of ₹${amount} added successfully!`);
    setAmount("");
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-header bg-warning text-dark fw-semibold">
        Manual Payment Entry
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium">Amount (₹)</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
            />
          </div>
          <button type="submit" className="btn btn-success btn-sm">
            Add Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualPaymentEntryForm;
