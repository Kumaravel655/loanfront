import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loanService } from '../../services/loanService';

const AuditTrailScreen = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, [filter]);

  const fetchAuditLogs = async () => {
    try {
      const data = await loanService.getAuditLogs(filter);
      setAuditLogs(data);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAuditLogs();
    setRefreshing(false);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create': return 'add-circle';
      case 'update': return 'edit';
      case 'delete': return 'delete';
      case 'login': return 'login';
      case 'logout': return 'logout';
      case 'approve': return 'check-circle';
      case 'reject': return 'cancel';
      case 'disburse': return 'account-balance-wallet';
      case 'collect': return 'payment';
      default: return 'info';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create': return '#28a745';
      case 'update': return '#007bff';
      case 'delete': return '#dc3545';
      case 'login': return '#17a2b8';
      case 'logout': return '#6c757d';
      case 'approve': return '#28a745';
      case 'reject': return '#dc3545';
      case 'disburse': return '#ffc107';
      case 'collect': return '#28a745';
      default: return '#6c757d';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const filterOptions = [
    { key: 'all', label: 'All Activities' },
    { key: 'loans', label: 'Loan Activities' },
    { key: 'users', label: 'User Activities' },
    { key: 'payments', label: 'Payment Activities' },
    { key: 'system', label: 'System Activities' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Audit Trail</Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                filter === option.key && styles.activeFilter
              ]}
              onPress={() => setFilter(option.key)}
            >
              <Text style={[
                styles.filterText,
                filter === option.key && styles.activeFilterText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.logsList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {auditLogs.map((log) => {
          const timestamp = formatTimestamp(log.timestamp);
          return (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.actionInfo}>
                  <MaterialIcons 
                    name={getActionIcon(log.action)} 
                    size={20} 
                    color={getActionColor(log.action)} 
                  />
                  <Text style={styles.actionText}>{log.action}</Text>
                </View>
                <Text style={styles.timestamp}>{timestamp.time}</Text>
              </View>
              
              <Text style={styles.description}>{log.description}</Text>
              
              <View style={styles.logDetails}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="person" size={16} color="#666" />
                  <Text style={styles.detailText}>User: {log.user_name}</Text>
                </View>
                
                {log.entity_type && (
                  <View style={styles.detailRow}>
                    <MaterialIcons name="category" size={16} color="#666" />
                    <Text style={styles.detailText}>Entity: {log.entity_type}</Text>
                  </View>
                )}
                
                {log.entity_id && (
                  <View style={styles.detailRow}>
                    <MaterialIcons name="tag" size={16} color="#666" />
                    <Text style={styles.detailText}>ID: {log.entity_id}</Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <MaterialIcons name="access-time" size={16} color="#666" />
                  <Text style={styles.detailText}>{timestamp.date}</Text>
                </View>
              </View>

              {log.changes && (
                <View style={styles.changesContainer}>
                  <Text style={styles.changesTitle}>Changes:</Text>
                  <View style={styles.changesContent}>
                    <Text style={styles.changesText}>{JSON.stringify(log.changes, null, 2)}</Text>
                  </View>
                </View>
              )}

              {log.ip_address && (
                <View style={styles.metaInfo}>
                  <MaterialIcons name="computer" size={14} color="#999" />
                  <Text style={styles.metaText}>IP: {log.ip_address}</Text>
                </View>
              )}
            </View>
          );
        })}
        
        {auditLogs.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="history" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No audit logs found</Text>
            <Text style={styles.emptySubtext}>Activities will appear here when they occur</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  filterContainer: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f8f9fa', marginRight: 8 },
  activeFilter: { backgroundColor: '#007bff' },
  filterText: { fontSize: 14, color: '#666' },
  activeFilterText: { color: '#fff' },
  logsList: { flex: 1, padding: 16 },
  logCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  actionInfo: { flexDirection: 'row', alignItems: 'center' },
  actionText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8, textTransform: 'capitalize' },
  timestamp: { fontSize: 12, color: '#999' },
  description: { fontSize: 14, color: '#666', marginBottom: 12 },
  logDetails: { marginBottom: 8 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  detailText: { fontSize: 12, color: '#666', marginLeft: 8 },
  changesContainer: { marginTop: 8, padding: 8, backgroundColor: '#f8f9fa', borderRadius: 4 },
  changesTitle: { fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  changesContent: { maxHeight: 100 },
  changesText: { fontSize: 10, color: '#666', fontFamily: 'monospace' },
  metaInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#eee' },
  metaText: { fontSize: 10, color: '#999', marginLeft: 4 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 16 },
  emptySubtext: { fontSize: 14, color: '#ccc', marginTop: 4 }
});

export default AuditTrailScreen;