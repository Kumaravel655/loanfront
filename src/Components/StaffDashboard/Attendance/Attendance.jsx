import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaUserCheck, FaUserTimes, FaClock, FaCalendarAlt, FaPercentage } from 'react-icons/fa';
import { loanService } from '../../../services/loanService';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([
    { id: 1, agent: 'Ravi Kumar', status: 'present', checkIn: '09:15', checkOut: '18:30' },
    { id: 2, agent: 'Priya Sharma', status: 'present', checkIn: '09:00', checkOut: '18:45' },
    { id: 3, agent: 'Amit Singh', status: 'absent', checkIn: null, checkOut: null }
  ]);

  useEffect(() => {
    // Fetch attendance data for selected date
  }, [selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const presentCount = attendanceData.filter(a => a.status === 'present').length;
  const attendanceRate = Math.round((presentCount / attendanceData.length) * 100);

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: '700',
              color: '#2d3748'
            }}>
              <FaCalendarCheck style={{marginRight: '8px'}} /> Attendance Management
            </h1>
            <p style={{
              margin: 0,
              color: '#718096',
              fontSize: '16px'
            }}>
              Track agent attendance and working hours
            </p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '24px'
      }}>
        <motion.div 
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <FaUserCheck style={{fontSize: '20px'}} />
          </div>
          <div>
            <h3 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {presentCount}
            </h3>
            <p style={{margin: 0, color: '#718096', fontSize: '14px'}}>Present Today</p>
          </div>
        </motion.div>

        <motion.div 
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <FaUserTimes style={{fontSize: '20px'}} />
          </div>
          <div>
            <h3 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {attendanceData.length - presentCount}
            </h3>
            <p style={{margin: 0, color: '#718096', fontSize: '14px'}}>Absent Today</p>
          </div>
        </motion.div>

        <motion.div 
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <FaPercentage style={{fontSize: '20px'}} />
          </div>
          <div>
            <h3 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#2d3748'}}>
              {attendanceRate}%
            </h3>
            <p style={{margin: 0, color: '#718096', fontSize: '14px'}}>Attendance Rate</p>
          </div>
        </motion.div>
      </div>

      {/* Attendance Table */}
      <motion.div 
        style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Agent</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Check In</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Check Out</th>
                <th style={{ color: 'white', padding: '16px', textAlign: 'left', fontWeight: '600' }}>Working Hours</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr 
                  key={record.id}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px', fontWeight: '600', color: '#2d3748' }}>
                    {record.agent}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: getStatusColor(record.status),
                      textTransform: 'capitalize'
                    }}>
                      {record.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {record.checkIn || '-'}
                  </td>
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {record.checkOut || '-'}
                  </td>
                  <td style={{ padding: '16px', color: '#2d3748' }}>
                    {record.checkIn && record.checkOut ? '9h 15m' : '-'}
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

export default Attendance;