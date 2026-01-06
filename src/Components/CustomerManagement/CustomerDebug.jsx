import React, { useState, useEffect } from 'react';
import { loanService } from '../../services/loanService';

const CustomerDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    token: null,
    apiUrl: null,
    error: null,
    response: null,
    loading: false
  });

  useEffect(() => {
    testCustomerAPI();
  }, []);

  const testCustomerAPI = async () => {
    setDebugInfo(prev => ({ ...prev, loading: true }));
    
    try {
      // Check token
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('Token:', token);
      console.log('User:', user);
      
      // Test API call
      const response = await loanService.getCustomers();
      
      setDebugInfo({
        token: token ? 'Present' : 'Missing',
        user: user ? JSON.parse(user) : null,
        apiUrl: 'http://127.0.0.1:8000/api/auth/customers/',
        response: response,
        error: null,
        loading: false
      });
      
    } catch (error) {
      console.error('API Error:', error);
      setDebugInfo(prev => ({
        ...prev,
        error: error.message,
        loading: false
      }));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Customer Management Debug</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Authentication Status:</h3>
        <p>Token: {debugInfo.token}</p>
        <p>User: {debugInfo.user ? debugInfo.user.email : 'Not logged in'}</p>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>API Configuration:</h3>
        <p>API URL: {debugInfo.apiUrl}</p>
        <p>Status: {debugInfo.loading ? 'Loading...' : 'Ready'}</p>
      </div>
      
      {debugInfo.error && (
        <div style={{ marginBottom: '20px', color: 'red' }}>
          <h3>Error:</h3>
          <pre>{debugInfo.error}</pre>
        </div>
      )}
      
      {debugInfo.response && (
        <div style={{ marginBottom: '20px', color: 'green' }}>
          <h3>Success - Customers Found:</h3>
          <p>Count: {Array.isArray(debugInfo.response) ? debugInfo.response.length : 'Not an array'}</p>
          <pre>{JSON.stringify(debugInfo.response, null, 2)}</pre>
        </div>
      )}
      
      <button onClick={testCustomerAPI} style={{ padding: '10px 20px' }}>
        Test API Again
      </button>
    </div>
  );
};

export default CustomerDebug;