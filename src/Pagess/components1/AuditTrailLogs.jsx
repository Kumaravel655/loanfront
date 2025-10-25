import React from "react";

const mockLogs = [
  {
    id: 1,
    user: "Alice",
    action: "Added role 'Manager'",
    timestamp: "2025-10-18 10:00",
  },
  {
    id: 2,
    user: "Bob",
    action: "Changed permission for 'User'",
    timestamp: "2025-10-18 11:30",
  },
];

const AuditTrailLogs = () => {
  return (
    <table className="table table-sm table-striped">
      <thead>
        <tr>
          <th>User</th>
          <th>Action</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {mockLogs.map((log) => (
          <tr key={log.id}>
            <td>{log.user}</td>
            <td>{log.action}</td>
            <td>{log.timestamp}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AuditTrailLogs;
