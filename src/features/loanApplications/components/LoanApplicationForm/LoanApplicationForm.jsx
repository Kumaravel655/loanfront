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
          
          <div className={styles.inputGroup}>
            <label>Customer *</label>
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
                <option key={c.customer_id} value={c.customer_id}>
                  {c.full_name} - {c.customer_code}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCustomer && (
            <div className={styles.customerInfo}>
              <h3>Customer Details</h3>
              <p><strong>Name:</strong> {selectedCustomer.full_name}</p>
              <p><strong>Code:</strong> {selectedCustomer.customer_code}</p>
              <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
              <p><strong>Email:</strong> {selectedCustomer.email}</p>
            </div>
          )}
        </section>
      )}

      {/* Step 2: Loan Details */}
      {step === 2 && (
        <section>
          <h2 className={styles.stepTitle}>Step 2: Loan Details</h2>
          
          <div className={styles.inputGroup}>
            <label>Loan Amount *</label>
            <input 
              type="number" 
              placeholder="Enter loan amount" 
              className={styles.input} 
              value={loanAmount} 
              onChange={e => setLoanAmount(e.target.value)}
              min="1000"
              max="10000000"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Loan Type *</label>
            <select className={styles.input} value={loanTypeId} onChange={e => setLoanTypeId(e.target.value)}>
              <option value="">-- Select Loan Type --</option>
              {loanTypes.map(t => <option key={t.loan_type_id} value={t.loan_type_id}>{t.name}</option>)}
            </select>
          </div>
          
          <div className={styles.inputGroup}>
            <label>Repayment Period (Months) *</label>
            <input 
              type="number" 
              placeholder="Number of months" 
              className={styles.input} 
              value={totalDue} 
              onChange={e => setTotalDue(e.target.value)}
              min="1"
              max="60"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Interest Rate (%) *</label>
            <input 
              type="number" 
              placeholder="Annual interest rate" 
              className={styles.input} 
              value={interestPercentage} 
              onChange={e => setInterestPercentage(e.target.value)}
              min="0"
              max="50"
              step="0.1"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Monthly EMI (Auto-calculated)</label>
            <input 
              type="number" 
              placeholder="Calculated automatically" 
              className={styles.input} 
              value={dueAmount} 
              readOnly 
              style={{backgroundColor: '#f5f5f5'}}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label>Repayment Mode *</label>
            <select className={styles.input} value={repaymentMode} onChange={e => setRepaymentMode(e.target.value)}>
              <option value="">-- Select Repayment Mode --</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          
          {loanAmount && totalDue && interestPercentage && (
            <div className={styles.loanSummary}>
              <h3>Loan Summary</h3>
              <p>Principal Amount: {parseFloat(loanAmount).toLocaleString()}</p>
              <p>Interest Rate: {interestPercentage}% per annum</p>
              <p>Loan Term: {totalDue} months</p>
              <p>Monthly EMI: {dueAmount}</p>
              <p>Total Amount: {(parseFloat(dueAmount) * parseInt(totalDue)).toLocaleString()}</p>
            </div>
          )}
        </section>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <section>
          <h2 className={styles.stepTitle}>Step 3: Review & Submit</h2>
          
          <div className={styles.reviewSection}>
            <h3>Application Review</h3>
            
            <div className={styles.reviewItem}>
              <strong>Customer:</strong> {selectedCustomer?.full_name} ({selectedCustomer?.customer_code})
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Loan Amount:</strong> {parseFloat(loanAmount).toLocaleString()}
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Interest Rate:</strong> {interestPercentage}% per annum
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Repayment Period:</strong> {totalDue} months
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Monthly EMI:</strong> {dueAmount}
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Repayment Mode:</strong> {repaymentMode}
            </div>
            
            <div className={styles.reviewItem}>
              <strong>Total Payable:</strong> {(parseFloat(dueAmount) * parseInt(totalDue)).toLocaleString()}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Created By (User ID) *</label>
            <input
              type="number"
              placeholder="Enter your user ID"
              className={styles.input}
              value={createdBy}
              onChange={e => setCreatedBy(e.target.value)}
            />
          </div>

          <div className={styles.submitActions}>
            <Button onClick={prevStep} variant="secondary">Previous</Button>
            <Button onClick={handleSubmit} variant="primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
          
          {submitError && <div className={styles.errorMsg}>{submitError}</div>}
          {submitSuccess && <div className={styles.successMsg}>{submitSuccess}</div>}
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
