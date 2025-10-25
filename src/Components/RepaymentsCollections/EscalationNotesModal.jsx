import React, { useState } from "react";

const EscalationNotesModal = ({ onClose }) => {
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    alert(`Saved notes: ${notes}`);
    onClose();
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Escalation Notes</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscalationNotesModal;
