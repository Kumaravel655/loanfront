import React, { useState, useEffect } from 'react';
import './Attendance.css';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedDate]);

  const fetchAttendanceData = async () => {
    setTimeout(() => {
      setAttendanceData({
        summary: {
          present: 18,
          absent: 3,
          late: 2,
          onLeave: 2,
          attendanceRate: 85.7
        },
        dailyAttendance: [
          {
            id: 1,
            name: 'Priya Sharma',
            checkIn: '09:05 AM',
            checkOut: '06:15 PM',
            status: 'present',
            location: 'Central Zone',
            workingHours: '9h 10m',
            lateMinutes: 5
          },
          {
            id: 2,
            name: 'Ravi Kumar',
            checkIn: '08:55 AM',
            checkOut: '06:20 PM',
            status: 'present',
            location: 'South Zone',
            workingHours: '9h 25m',
            lateMinutes: 0
          },
          {
            id: 3,
            name: 'Meena Patel',
            checkIn: '09:25 AM',
            checkOut: '06:10 PM',
            status: 'late',
            location: 'West Zone',
            workingHours: '8h 45m',
            lateMinutes: 25
          },
          {
            id: 4,
            name: 'Rahul Dev',
            checkIn: '-',
            checkOut: '-',
            status: 'absent',
            location: 'North Zone',
            workingHours: '0h 0m',
            lateMinutes: 0
          },
          {
            id: 5,
            name: 'Ankit Singh',
            checkIn: '09:15 AM',
            checkOut: '05:45 PM',
            status: 'present',
            location: 'East Zone',
            workingHours: '8h 30m',
            lateMinutes: 15
          }
        ],
        monthlyStats: [
          { month: 'Jan', present: 22, absent: 3, late: 2, rate: 88.9 },
          { month: 'Feb', present: 20, absent: 4, late: 3, rate: 83.3 },
          { month: 'Mar', present: 23, absent: 2, late: 1, rate: 92.0 },
          { month: 'Apr', present: 21, absent: 3, late: 2, rate: 87.5 },
          { month: 'May', present: 24, absent: 1, late: 1, rate: 96.0 },
          { month: 'Jun', present: 18, absent: 3, late: 2, rate: 85.7 }
        ],
        leaveRequests: [
          {
            id: 1,
            name: 'Rahul Dev',
            type: 'Sick Leave',
            from: '2024-06-15',
            to: '2024-06-16',
            status: 'approved',
            reason: 'Medical appointment'
          },
          {
            id: 2,
            name: 'Priya Sharma',
            type: 'Personal Leave',
            from: '2024-06-20',
            to: '2024-06-21',
            status: 'pending',
            reason: 'Family function'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10B981';
      case 'absent': return '#EF4444';
      case 'late': return '#F59E0B';
      case 'onLeave': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const handleApproveLeave = (requestId) => {
    setAttendanceData(prev => ({
      ...prev,
      leaveRequests: prev.leaveRequests.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      )
    }));
  };

  const handleRejectLeave = (requestId) => {
    setAttendanceData(prev => ({
      ...prev,
      leaveRequests: prev.leaveRequests.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' } : req
      )
    }));
  };

  if (loading) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className="attendance">
      <div className="page-header">
        <div>
          <h1>Attendance Management</h1>
          <p>Track and manage team attendance and leave requests</p>
        </div>
        <div className="date-selector">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon present">✅</div>
          <div className="card-content">
            <h3>Present</h3>
            <p className="card-number">{attendanceData.summary.present}</p>
            <span className="card-subtitle">Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon absent">❌</div>
          <div className="card-content">
            <h3>Absent</h3>
            <p className="card-number">{attendanceData.summary.absent}</p>
            <span className="card-subtitle">Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon late">⏰</div>
          <div className="card-content">
            <h3>Late Arrivals</h3>
            <p className="card-number">{attendanceData.summary.late}</p>
            <span className="card-subtitle">Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon leave">🏖️</div>
          <div className="card-content">
            <h3>On Leave</h3>
            <p className="card-number">{attendanceData.summary.onLeave}</p>
            <span className="card-subtitle">Agents</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon rate">📊</div>
          <div className="card-content">
            <h3>Attendance Rate</h3>
            <p className="card-number">{attendanceData.summary.attendanceRate}%</p>
            <span className="card-subtitle">Overall</span>
          </div>
        </div>
      </div>

      {/* Daily Attendance */}
      <div className="attendance-section">
        <h3>Daily Attendance - {new Date(selectedDate).toLocaleDateString()}</h3>
        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Agent</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Location</th>
                <th>Working Hours</th>
                <th>Late By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.dailyAttendance.map(record => (
                <tr key={record.id}>
                  <td>
                    <div className="agent-info">
                      <div className="agent-avatar">
                        {record.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {record.name}
                    </div>
                  </td>
                  <td className={record.checkIn === '-' ? 'absent' : ''}>{record.checkIn}</td>
                  <td className={record.checkOut === '-' ? 'absent' : ''}>{record.checkOut}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(record.status) }}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td>{record.location}</td>
                  <td>{record.workingHours}</td>
                  <td>
                    {record.lateMinutes > 0 ? (
                      <span className="late-time">{record.lateMinutes} mins</span>
                    ) : (
                      <span className="on-time">On Time</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {record.status === 'absent' && (
                        <button className="btn-mark-present">Mark Present</button>
                      )}
                      {record.status === 'late' && (
                        <button className="btn-excuse">Excuse</button>
                      )}
                      <button className="btn-view">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="attendance-content">
        {/* Monthly Trends */}
        <div className="trends-section">
          <h3>Monthly Attendance Trends</h3>
          <div className="trends-grid">
            {attendanceData.monthlyStats.map(month => (
              <div key={month.month} className="trend-card">
                <h4>{month.month}</h4>
                <div className="trend-stats">
                  <div className="stat">
                    <span className="label">Present:</span>
                    <span className="value">{month.present}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Absent:</span>
                    <span className="value absent">{month.absent}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Late:</span>
                    <span className="value late">{month.late}</span>
                  </div>
                </div>
                <div className="attendance-rate">
                  <div className="rate-label">Attendance Rate</div>
                  <div className="rate-value">{month.rate}%</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${month.rate}%`,
                        backgroundColor: month.rate >= 90 ? '#10B981' : 
                                       month.rate >= 80 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave Requests */}
        <div className="leave-section">
          <h3>Leave Requests</h3>
          <div className="leave-requests">
            {attendanceData.leaveRequests.map(request => (
              <div key={request.id} className="leave-card">
                <div className="leave-header">
                  <div className="requester-info">
                    <div className="requester-avatar">
                      {request.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="requester-name">{request.name}</div>
                      <div className="leave-type">{request.type}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="leave-details">
                  <div className="date-range">
                    {new Date(request.from).toLocaleDateString()} - {new Date(request.to).toLocaleDateString()}
                  </div>
                  <div className="reason">{request.reason}</div>
                </div>
                {request.status === 'pending' && (
                  <div className="leave-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleApproveLeave(request.id)}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleRejectLeave(request.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons-grid">
          <button className="action-btn">
            📥 Import Attendance
          </button>
          <button className="action-btn">
            📊 Generate Report
          </button>
          <button className="action-btn">
            ⚙️ Configure Settings
          </button>
          <button className="action-btn">
            👥 Bulk Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;