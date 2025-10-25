import React, { useState } from "react";

const mockRoles = ["Admin", "Manager", "User"];
const mockModules = ["Dashboard", "Transactions", "Reports"];

const PermissionMatrixTable = ({ onEditRole }) => {
  const [permissions, setPermissions] = useState(
    mockRoles.reduce((acc, role) => {
      acc[role] = mockModules.reduce(
        (mAcc, mod) => ({ ...mAcc, [mod]: false }),
        {}
      );
      return acc;
    }, {})
  );

  const togglePermission = (role, module) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: { ...prev[role], [module]: !prev[role][module] },
    }));
  };

  return (
    <table className="table table-bordered text-center">
      <thead>
        <tr>
          <th>Role \ Module</th>
          {mockModules.map((mod) => (
            <th key={mod}>{mod}</th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {mockRoles.map((role) => (
          <tr key={role}>
            <td>{role}</td>
            {mockModules.map((mod) => (
              <td key={mod}>
                <input
                  type="checkbox"
                  checked={permissions[role][mod]}
                  onChange={() => togglePermission(role, mod)}
                />
              </td>
            ))}
            <td>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => onEditRole({ role })}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PermissionMatrixTable;
