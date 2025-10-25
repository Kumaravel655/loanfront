import React from 'react';

const ApplicationTable = ({ applications }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead style={{ backgroundColor: '#4CAF50', color: 'white' }}>
        <tr>
          <th style={{ padding: '10px' }}>Loan ID</th>
          <th style={{ padding: '10px' }}>Customer</th>
          <th style={{ padding: '10px' }}>Loan Type</th>
          <th style={{ padding: '10px' }}>Principal Amount</th>
          <th style={{ padding: '10px' }}>Due Amount</th>
          <th style={{ padding: '10px' }}>Interest %</th>
          <th style={{ padding: '10px' }}>Repayment Mode</th>
          <th style={{ padding: '10px' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((loan, index) => (
          <tr
            key={loan.loan_id}
            style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
          >
            <td style={{ padding: '10px', textAlign: 'center' }}>{loan.loan_id}</td>
            <td style={{ padding: '10px' }}>
              {loan.customer.full_name} ({loan.customer.customer_code})
            </td>
            <td style={{ padding: '10px' }}>{loan.loan_type.name}</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{loan.principal_amount}</td>
            <td style={{ padding: '10px', textAlign: 'right' }}>{loan.due_amount}</td>
            <td style={{ padding: '10px', textAlign: 'center' }}>{loan.interest_percentage}</td>
            <td style={{ padding: '10px', textAlign: 'center' }}>{loan.repayment_mode}</td>
            <td style={{ padding: '10px', textAlign: 'center' }}>{loan.loan_status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ApplicationTable;
