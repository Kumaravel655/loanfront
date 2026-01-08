import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loanService } from '../../services/loanService';

const CustomerManagementScreen = () => {
  const [customers, setCustomers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    aadhar_number: '',
    pan_number: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await loanService.getCustomers();
      setCustomers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch customers');
    }
  };

  const handleAddCustomer = async () => {
    try {
      await loanService.addCustomer(formData);
      setFormData({ name: '', email: '', phone: '', address: '', aadhar_number: '', pan_number: '' });
      setShowAddForm(false);
      fetchCustomers();
      Alert.alert('Success', 'Customer added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add customer');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Management</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Customer</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({...formData, email: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({...formData, phone: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={formData.address}
            onChangeText={(text) => setFormData({...formData, address: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Aadhar Number"
            value={formData.aadhar_number}
            onChangeText={(text) => setFormData({...formData, aadhar_number: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="PAN Number"
            value={formData.pan_number}
            onChangeText={(text) => setFormData({...formData, pan_number: text})}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddForm(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddCustomer}>
              <Text style={styles.submitText}>Add Customer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.customerList}>
        {customers.map((customer) => (
          <View key={customer.id} style={styles.customerCard}>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <Text style={styles.customerEmail}>{customer.email}</Text>
              <Text style={styles.customerPhone}>{customer.phone}</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <MaterialIcons name="visibility" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8 },
  formContainer: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 8, flex: 0.45 },
  submitButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8, flex: 0.45 },
  cancelText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  submitText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  customerList: { flex: 1 },
  customerCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  customerEmail: { fontSize: 14, color: '#666', marginTop: 4 },
  customerPhone: { fontSize: 14, color: '#666', marginTop: 2 },
  viewButton: { padding: 8 }
});

export default CustomerManagementScreen;