import React, { useState } from "react";
import UserTable from "./components1/UserTable";
import PermissionMatrixTable from "./components1/PermissionMatrixTable";
import RoleEditorModal from "./components1/RoleEditorModal";
import InviteUserForm from "./components1/InviteUserForm";
import AuditTrailLogs from "./components1/AuditTrailLogs";

const RolesPermissionsPage = () => {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editRoleData, setEditRoleData] = useState(null);

  const handleEditRole = (role) => {
    setEditRoleData(role);
    setShowRoleModal(true);
  };

  return (
    <div className="container p-4">
      <h2>Roles & Permissions</h2>

      {/* User List Section */}
      <section className="mt-4">
        <h4>User List</h4>
        <UserTable onEditRole={handleEditRole} />
      </section>

      {/* Role Matrix Section */}
      <section className="mt-5">
        <h4>Role Matrix</h4>
        <PermissionMatrixTable onEditRole={handleEditRole} />
      </section>

      {/* Invite User Section */}
      <section className="mt-5">
        <h4>Invite User</h4>
        <InviteUserForm />
      </section>

      {/* Audit Trail Section */}
      <section className="mt-5">
        <h4>Audit Trail</h4>
        <AuditTrailLogs />
      </section>

      {/* Role Editor Modal */}
      {showRoleModal && (
        <RoleEditorModal
          role={editRoleData}
          onClose={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
};

export default RolesPermissionsPage;
