import React, { useState } from "react";

const roles = ["Admin", "Manager", "User"];

const InviteUserForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(roles[0]);

  const handleInvite = () => {
    alert(`Invite sent to ${email} as ${role}`);
    setEmail("");
  };

  return (
    <div>
      <input
        type="email"
        className="form-control mb-2"
        placeholder="User Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className="form-control mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button className="btn btn-primary" onClick={handleInvite}>
        Send Invite
      </button>
    </div>
  );
};

export default InviteUserForm;
