import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { loanService } from '../services/loanService';

const LoanApplicationFormScreen = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_id: '',
    loan_amount: '',
    loan_type: 'personal',
    tenure_months: '',
    interest_rate: '',
    purpose: '',
    monthly_income: '',
    employment_type: 'salaried'
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

  const handleSubmit = async () => {
    try {
      if (!formData.customer_id || !formData.loan_amount || !formData.tenure_months) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }
      
      await loanService.createLoanApplication(formData);
      Alert.alert('Success', 'Loan application submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit loan application');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>New Loan Application</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Customer *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.customer_id}
            onValueChange={(value) => setFormData({...formData, customer_id: value})}
            style={styles.picker}
          >
            <Picker.Item label="Select Customer" value="" />
            {customers.map(customer => (
              <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Loan Amount *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter loan amount"
          value={formData.loan_amount}
          onChangeText={(text) => setFormData({...formData, loan_amount: text})}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Loan Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.loan_type}
            onValueChange={(value) => setFormData({...formData, loan_type: value})}
            style={styles.picker}
          >
            <Picker.Item label="Personal Loan" value="personal" />
            <Picker.Item label="Business Loan" value="business" />
            <Picker.Item label="Home Loan" value="home" />
            <Picker.Item label="Vehicle Loan" value="vehicle" />
          </Picker>
        </View>

        <Text style={styles.label}>Tenure (Months) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tenure in months"
          value={formData.tenure_months}
          onChangeText={(text) => setFormData({...formData, tenure_months: text})}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter interest rate"
          value={formData.interest_rate}
          onChangeText={(text) => setFormData({...formData, interest_rate: text})}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Purpose</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter loan purpose"
          value={formData.purpose}
          onChangeText={(text) => setFormData({...formData, purpose: text})}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Monthly Income</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter monthly income"
          value={formData.monthly_income}
          onChangeText={(text) => setFormData({...formData, monthly_income: text})}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Employment Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.employment_type}
            onValueChange={(value) => setFormData({...formData, employment_type: value})}
            style={styles.picker}
          >
            <Picker.Item label="Salaried" value="salaried" />
            <Picker.Item label="Self Employed" value="self_employed" />
            <Picker.Item label="Business Owner" value="business" />
            <Picker.Item label="Freelancer" value="freelancer" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 16, color: '#333' },
  form: { padding: 16 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, backgroundColor: '#fff' },
  textArea: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, backgroundColor: '#fff', height: 80, textAlignVertical: 'top' },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, backgroundColor: '#fff' },
  picker: { height: 50 },
  submitButton: { backgroundColor: '#28a745', padding: 16, borderRadius: 8, marginTop: 24 },
  submitText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});

export default LoanApplicationFormScreen;