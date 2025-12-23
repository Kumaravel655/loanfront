import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './LoanApplicationForm.module.css';
import Button from '../../../../components/common/Button/Button';

const LoanApplicationForm = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3; // No document upload

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [loanAmount, setLoanAmount] = useState('');
  const [loanTypeId, setLoanTypeId] = useState('');
  const [loanTypes, setLoanTypes] = useState([]);

  const [totalDue, setTotalDue] = useState('');
  const [dueAmount, setDueAmount] = useState('');
  const [interestPercentage, setInterestPercentage] = useState('');
  const [repaymentMode, setRepaymentMode] = useState('');

  const [createdBy, setCreatedBy] = useState(''); // now user-input
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const token = localStorage.getItem('token');

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  // Fetch customers
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/auth/customers/', {
      headers: { Authorization: `Token ${token}` },
    })
    .then(res => setCustomers(res.data))
    .catch(err => console.error(err));
  }, [token]);

  // Fetch loan types
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/auth/loan-types/', {
      headers: { Authorization: `Token ${token}` },
    })
    .then(res => setLoanTypes(res.data))
    .catch(err => console.error(err));
  }, [token]);

  // Auto-calculate due_amount
  useEffect(() => {
    if (loanAmount && totalDue && interestPercentage) {
      const principal = parseFloat(loanAmount);
      const interest = (parseFloat(interestPercentage) / 100) * principal;
      const totalPayable = principal + interest;
      setDueAmount((totalPayable / parseInt(totalDue)).toFixed(2));
    }
  }, [loanAmount, totalDue, interestPercentage]);

  const handleSubmit = async () => {
    const customerId = selectedCustomer?.customer_id;
    const loanType = parseInt(loanTypeId);
    const principal = parseFloat(loanAmount);
    const totalDueCount = parseInt(totalDue);
    const interest = interestPercentage ? parseFloat(interestPercentage) : 0;
    const due = dueAmount ? parseFloat(dueAmount) : 0;
    const createdById = createdBy ? parseInt(createdBy) : null;

    // Collect missing mandatory fields
    const missingFields = [];
    if (!customerId) missingFields.push('Customer');
    if (!loanType) missingFields.push('Loan Type');
    if (!principal) missingFields.push('Loan Amount');
    if (!totalDueCount) missingFields.push('Total Due Count');
    if (!repaymentMode) missingFields.push('Repayment Mode');
    if (!createdById) missingFields.push('Created By');

    if (missingFields.length > 0) {
      setSubmitError(`Please fill the following mandatory fields: ${missingFields.join(', ')}`);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const payload = {
        customer_id: customerId,
        loan_type_id: loanType,
        principal_amount: principal,
        total_due_count: totalDueCount,
        due_amount: due,
        interest_percentage: interest,
        repayment_mode: repaymentMode,
        loan_status: 'active',
        created_by: createdById, // ✅ corrected
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/auth/loans/',
        payload,
        { headers: { Authorization: `Token ${token}` } }
      );

      setSubmitSuccess('Loan application submitted successfully!');
      console.log(response.data);
      
      // Call success callback to refresh parent list
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      }
    } catch (err) {
      console.error(err);
      if (err.response) console.error('Response data:', err.response.data);
      setSubmitError('Failed to submit loan application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.progressTracker}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
      </div>

      {/* Step 1: Customer */}
      {step === 1 && (
        <section>
          <h2 className={styles.stepTitle}>Step 1: Select Customer</h2>
          <select
            className={styles.input}
            value={selectedCustomer?.customer_id || ''}
            onChange={e => {
              const customer = customers.find(c => c.customer_id === parseInt(e.target.value));
              setSelectedCustomer(customer);
            }}
          >
            <option value="">-- Select Customer --</option>
            {customers.map(c => (
              <option key={c.customer_id} value={c.customer_id}>{c.full_name}</option>
            ))}
          </select>
        </section>
      )}

      {/* Step 2: Loan Details */}
      {step === 2 && (
        <section>
          <h2 className={styles.stepTitle}>Step 2: Loan Details</h2>
          <input type="number" placeholder="Loan Amount" className={styles.input} value={loanAmount} onChange={e => setLoanAmount(e.target.value)} />
          <select className={styles.input} value={loanTypeId} onChange={e => setLoanTypeId(e.target.value)}>
            <option value="">-- Select Loan Type --</option>
            {loanTypes.map(t => <option key={t.loan_type_id} value={t.loan_type_id}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="Total Due Count" className={styles.input} value={totalDue} onChange={e => setTotalDue(e.target.value)} />
          <input type="number" placeholder="Interest %" className={styles.input} value={interestPercentage} onChange={e => setInterestPercentage(e.target.value)} />
          <input type="number" placeholder="Due Amount (auto)" className={styles.input} value={dueAmount} readOnly />
          <select className={styles.input} value={repaymentMode} onChange={e => setRepaymentMode(e.target.value)}>
            <option value="">-- Repayment Mode --</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </section>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <section>
          <h2 className={styles.stepTitle}>Step 3: Review & Submit</h2>

          {/* Created By input */}
          <input
            type="number"
            placeholder="Created By (User ID)"
            className={styles.input}
            value={createdBy}
            onChange={e => setCreatedBy(e.target.value)}
          />

          <Button onClick={prevStep} variant="secondary">Previous</Button>
          <Button onClick={handleSubmit} variant="primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </Button>
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
          {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}
        </section>
      )}

      {/* Navigation */}
      {step < totalSteps && (
        <div className={styles.navigation}>
          {step > 1 && <Button onClick={prevStep} variant="secondary">Previous</Button>}
          <Button onClick={nextStep} variant="primary">Next</Button>
        </div>
      )}
    </div>
  );
};

export default LoanApplicationForm;
