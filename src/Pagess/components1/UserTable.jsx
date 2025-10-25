import React from "react";

const mockUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-10-18",
  },
  {
    id: 2,
    name: "Bob Smith",
    role: "Manager",
    status: "Inactive",
    lastLogin: "2025-10-17",
  },
];

const UserTable = ({ onEditRole }) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
          <th>Last Login</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {mockUsers.map((user) => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
            <td>{user.lastLogin}</td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => onEditRole(user)}
              >
                Edit Role
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
