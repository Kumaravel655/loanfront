import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { loanService } from '../../services/loanService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalLoans: 0,
    totalCustomers: 0,
    totalAgents: 0,
    overdueLoans: 0,
    todayCollection: 0,
    pendingAmount: 0,
    monthlyTrend: [],
    loading: false,
  });
  const [refreshing, setRefreshing] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      const [loans, customers, agents, schedules, collections] = await Promise.all([
        loanService.getLoans().catch(() => []),
        loanService.getCustomers().catch(() => []),
        loanService.getCollectionAgents().catch(() => []),
        loanService.getLoanSchedules().catch(() => []),
        loanService.getDailyCollections().catch(() => [])
      ]);
      
      const today = new Date().toISOString().split('T')[0];
      const overdueSchedules = schedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      
      const todayCollections = collections.filter(c => c.collection_date === today);
      const todayCollection = todayCollections.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
      
      const pendingSchedules = schedules.filter(s => s.status === 'pending');
      const pendingAmount = pendingSchedules.reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      // Generate monthly trend
      const monthlyTrend = [];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      for (let i = 0; i < 6; i++) {
        const monthCollections = collections.filter(c => {
          const date = new Date(c.collection_date);
          return date.getMonth() === (new Date().getMonth() - 5 + i + 12) % 12;
        });
        const amount = monthCollections.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
        monthlyTrend.push(amount / 100000); // Scale for chart
      }
      
      setDashboardData({
        totalLoans: loans.length,
        totalCustomers: customers.length,
        totalAgents: agents.length,
        overdueLoans: overdueSchedules.length,
        todayCollection,
        pendingAmount,
        monthlyTrend,
        loading: false,
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(102, 126, 234, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.username || 'Admin'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Loans"
          value={dashboardData.totalLoans.toLocaleString()}
          icon="card"
          color="#3b82f6"
          subtitle="Active loans"
        />
        <StatCard
          title="Today's Collection"
          value={formatCurrency(dashboardData.todayCollection)}
          icon="cash"
          color="#10b981"
          subtitle="Collected today"
        />
        <StatCard
          title="Pending Amount"
          value={formatCurrency(dashboardData.pendingAmount)}
          icon="time"
          color="#f59e0b"
          subtitle="Outstanding"
        />
        <StatCard
          title="Overdue Loans"
          value={dashboardData.overdueLoans}
          icon="warning"
          color="#ef4444"
          subtitle="Need attention"
        />
        <StatCard
          title="Total Customers"
          value={dashboardData.totalCustomers.toLocaleString()}
          icon="people"
          color="#06b6d4"
          subtitle="Registered"
        />
        <StatCard
          title="Collection Agents"
          value={dashboardData.totalAgents}
          icon="person"
          color="#8b5cf6"
          subtitle="Active agents"
        />
      </View>

      {/* Simple Chart Placeholder */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Collection Trend</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>Chart data visualization</Text>
          <Text style={styles.chartSubtext}>Monthly trends will appear here</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
            <Ionicons name="add-circle" size={24} color="white" />
            <Text style={styles.actionText}>New Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]}>
            <Ionicons name="people" size={24} color="white" />
            <Text style={styles.actionText}>Customers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}>
            <Ionicons name="bar-chart" size={24} color="white" />
            <Text style={styles.actionText}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]}>
            <Ionicons name="refresh" size={24} color="white" />
            <Text style={styles.actionText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#667eea',
    paddingTop: 50,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 8,
  },
  statsGrid: {
    padding: 16,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  chartContainer: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  chartText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  chartSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    marginTop: 8,
  },
});

export default AdminDashboard;