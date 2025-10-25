import React from "react";

const StatusBadge = ({ status }) => {
  const color = status === "Paid" ? "success" : "danger";
  return <span className={`badge bg-${color}`}>{status}</span>;
};

export default StatusBadge;
