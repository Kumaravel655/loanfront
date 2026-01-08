import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loanService } from '../../services/loanService';

const DisbursementScreen = () => {
  const [disbursements, setDisbursements] = useState([]);
  const [pendingDisbursements, setPendingDisbursements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDisbursements();
  }, []);

  const fetchDisbursements = async () => {
    try {
      const [disbursementData, pendingData] = await Promise.all([
        loanService.getDisbursements(),
        loanService.getPendingDisbursements()
      ]);
      setDisbursements(disbursementData);
      setPendingDisbursements(pendingData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch disbursements');
    }
  };

  const handleDisburse = async (loanId) => {
    try {
      await loanService.disburseLoan(loanId);
      Alert.alert('Success', 'Loan disbursed successfully');
      fetchDisbursements();
    } catch (error) {
      Alert.alert('Error', 'Failed to disburse loan');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDisbursements();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disbursed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'failed': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Disbursement Management</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Disbursements</Text>
        {pendingDisbursements.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.loanId}>Loan #{item.loan_id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.amount}>₹{item.amount?.toLocaleString()}</Text>
            <Text style={styles.date}>Applied: {new Date(item.created_at).toLocaleDateString()}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.disburseButton}
                onPress={() => handleDisburse(item.loan_id)}
              >
                <MaterialIcons name="account-balance-wallet" size={16} color="#fff" />
                <Text style={styles.buttonText}>Disburse</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewButton}>
                <MaterialIcons name="visibility" size={16} color="#007bff" />
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Disbursements</Text>
        {disbursements.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.loanId}>Loan #{item.loan_id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.customerName}>{item.customer_name}</Text>
            <Text style={styles.amount}>₹{item.amount?.toLocaleString()}</Text>
            <Text style={styles.date}>Disbursed: {new Date(item.disbursed_at).toLocaleDateString()}</Text>
            
            <View style={styles.disbursementInfo}>
              <View style={styles.infoRow}>
                <MaterialIcons name="account-balance" size={16} color="#666" />
                <Text style={styles.infoText}>Bank: {item.bank_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name="confirmation-number" size={16} color="#666" />
                <Text style={styles.infoText}>Ref: {item.reference_number}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  loanId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  customerName: { fontSize: 14, color: '#666', marginBottom: 4 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#28a745', marginBottom: 4 },
  date: { fontSize: 12, color: '#999', marginBottom: 12 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  disburseButton: { backgroundColor: '#28a745', flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 6, flex: 0.48 },
  viewButton: { backgroundColor: '#f8f9fa', flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 6, flex: 0.48, borderWidth: 1, borderColor: '#007bff' },
  buttonText: { color: '#fff', marginLeft: 4, fontWeight: 'bold' },
  viewButtonText: { color: '#007bff', marginLeft: 4, fontWeight: 'bold' },
  disbursementInfo: { marginTop: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { marginLeft: 8, fontSize: 12, color: '#666' }
});

export default DisbursementScreen;