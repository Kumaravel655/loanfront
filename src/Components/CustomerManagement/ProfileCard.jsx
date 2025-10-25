import React, { useState } from "react";


import "bootstrap/dist/css/bootstrap.min.css";

const ProfileCard = ({ customer }) => {
  const [isCRMOpen, setIsCRMOpen] = useState(false);

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header bg-primary text-white">Customer Profile</div>
      <div className="card-body">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Contact:</strong> {customer.contact}</p>
        <p><strong>Segment:</strong> {customer.segment}</p>
        <p>
          <strong>Relationship Score:</strong>{" "}
          <span className="badge bg-success">{customer.relationshipScore}</span>
        </p>

        {/* Open CRM Button */}
        <button
          className="btn btn-info mt-3"
          onClick={() => setIsCRMOpen(true)}
        >
          Open CRM
        </button>
      </div>

      {/* Render CRMWidget modal */}
      {isCRMOpen && (
        <CRMWidget
          customerId={customer.id}
          onClose={() => setIsCRMOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;
