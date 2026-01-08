import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loanService } from '../../services/loanService';

const RolesPermissionsScreen = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, rolesData, permissionsData] = await Promise.all([
        loanService.getUsers(),
        loanService.getRoles(),
        loanService.getPermissions()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await loanService.updateUserRole(userId, newRole);
      Alert.alert('Success', 'User role updated successfully');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const handlePermissionToggle = async (roleId, permissionId, enabled) => {
    try {
      await loanService.updateRolePermission(roleId, permissionId, enabled);
      Alert.alert('Success', 'Permission updated successfully');
      fetchData();
    } catch (error) {
      Alert.alert('Error', 'Failed to update permission');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'staff': return '#007bff';
      case 'collection_agent': return '#28a745';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Roles & Permissions</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Management</Text>
        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.username?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                  <Text style={styles.roleText}>{user.role}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setSelectedUser(user)}
            >
              <MaterialIcons name="edit" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Role Permissions Matrix</Text>
        {roles.map((role) => (
          <View key={role.id} style={styles.roleCard}>
            <Text style={styles.roleName}>{role.name}</Text>
            <Text style={styles.roleDescription}>{role.description}</Text>
            
            <View style={styles.permissionsGrid}>
              {permissions.map((permission) => (
                <View key={permission.id} style={styles.permissionRow}>
                  <Text style={styles.permissionName}>{permission.name}</Text>
                  <Switch
                    value={role.permissions?.includes(permission.id)}
                    onValueChange={(value) => 
                      handlePermissionToggle(role.id, permission.id, value)
                    }
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={role.permissions?.includes(permission.id) ? '#f5dd4b' : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {selectedUser && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User Role</Text>
            <Text style={styles.modalUser}>{selectedUser.username}</Text>
            
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleOption,
                  selectedUser.role === role.name && styles.selectedRole
                ]}
                onPress={() => {
                  handleRoleChange(selectedUser.id, role.name);
                  setSelectedUser(null);
                }}
              >
                <Text style={[
                  styles.roleOptionText,
                  selectedUser.role === role.name && styles.selectedRoleText
                ]}>
                  {role.name}
                </Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setSelectedUser(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  userCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#007bff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontWeight: 'bold' },
  userDetails: { flex: 1 },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  userEmail: { fontSize: 14, color: '#666', marginTop: 2 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 4 },
  roleText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  editButton: { padding: 8 },
  roleCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  roleName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  roleDescription: { fontSize: 14, color: '#666', marginBottom: 16 },
  permissionsGrid: { marginTop: 8 },
  permissionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  permissionName: { fontSize: 14, color: '#333', flex: 1 },
  modal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  modalUser: { fontSize: 16, color: '#666', marginBottom: 16 },
  roleOption: { padding: 12, borderRadius: 8, marginBottom: 8, backgroundColor: '#f8f9fa' },
  selectedRole: { backgroundColor: '#007bff' },
  roleOptionText: { fontSize: 16, color: '#333', textAlign: 'center' },
  selectedRoleText: { color: '#fff' },
  cancelButton: { padding: 12, borderRadius: 8, backgroundColor: '#6c757d', marginTop: 8 },
  cancelText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default RolesPermissionsScreen;