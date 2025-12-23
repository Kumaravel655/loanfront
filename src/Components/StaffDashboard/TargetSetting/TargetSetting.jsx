import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';
import { FaBullseye, FaChartLine, FaArrowUp, FaArrowDown, FaTrophy, FaEdit, FaAdjust } from 'react-icons/fa';

const TargetSetting = () => {
  const [targets, setTargets] = useState([
    { id: 1, agent: 'Ravi Kumar', monthly: 50000, achieved: 45000, percentage: 90 },
    { id: 2, agent: 'Priya Sharma', monthly: 60000, achieved: 58000, percentage: 97 },
    { id: 3, agent: 'Amit Singh', monthly: 45000, achieved: 40000, percentage: 89 }
  ]);

  const [editingTarget, setEditingTarget] = useState(null);

  useEffect(() => {
    // Fetch targets from API
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <motion.div 
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '28px',
          fontWeight: '700',
          color: '#2d3748'
        }}>
          <FaBullseye style={{marginRight: '8px'}} /> Target Setting
        </h1>
        <p style={{
          margin: 0,
          color: '#718096',
          fontSize: '16px'
        }}>
          Set and manage collection targets for agents
        </p>
      </motion.div>

      {/* Targets Table */}
      <motion.div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Agent</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Monthly Target</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Achieved</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Progress</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((target) => (
                <tr 
                  key={target.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', fontWeight: '600', color: '#2d3748' }}>
                    {target.agent}
                  </td>
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {formatCurrency(target.monthly)}
                  </td>
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {formatCurrency(target.achieved)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '100px',
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${target.percentage}%`,
                          height: '100%',
                          background: target.percentage >= 90 ? '#10b981' : target.percentage >= 70 ? '#f59e0b' : '#ef4444',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: target.percentage >= 90 ? '#10b981' : target.percentage >= 70 ? '#f59e0b' : '#ef4444'
                      }}>
                        {target.percentage}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{
                      padding: '6px 12px',
                      background: '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaEdit style={{fontSize: '10px'}} />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TargetSetting;