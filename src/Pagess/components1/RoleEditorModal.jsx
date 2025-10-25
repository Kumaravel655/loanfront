import React, { useState, useEffect } from "react";

const RoleEditorModal = ({ role, onClose }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (role) setRoleName(role.role || role.name);
  }, [role]);

  const handleSave = () => {
    alert(`Saved role: ${roleName}`);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-3 bg-white rounded shadow">
        <h4>{role ? "Edit Role" : "Add Role"}</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default RoleEditorModal;
