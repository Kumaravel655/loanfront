import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { loanService } from '../../services/loanService';
import { useAuth } from '../../context/AuthContext';

const AgentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todayCollection: 0,
    pendingDues: 0,
    overdueLoans: 0,
    assignedLoans: 0,
    completionRate: 0,
    upcomingDues: [],
    recentCollections: [],
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
      
      const schedules = await loanService.getLoanSchedules();
      const today = new Date().toISOString().split('T')[0];
      
      // Filter schedules for current user
      const userSchedules = schedules.filter(schedule => 
        schedule.assigned_to === user?.id
      );
      
      const todaySchedules = userSchedules.filter(s => s.due_date === today);
      const pendingSchedules = userSchedules.filter(s => s.status === 'pending');
      const overdueSchedules = userSchedules.filter(s => 
        new Date(s.due_date) < new Date() && s.status === 'pending'
      );
      const completedSchedules = userSchedules.filter(s => s.status === 'done');
      
      const todayCollection = todaySchedules
        .filter(s => s.status === 'done')
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      const pendingDues = pendingSchedules
        .reduce((sum, s) => sum + parseFloat(s.total_due || 0), 0);
      
      const completionRate = userSchedules.length > 0 
        ? Math.round((completedSchedules.length / userSchedules.length) * 100)
        : 0;
      
      // Get upcoming dues (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingDues = pendingSchedules
        .filter(s => new Date(s.due_date) <= nextWeek)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);
      
      setDashboardData({
        todayCollection,
        pendingDues,
        overdueLoans: overdueSchedules.length,
        assignedLoans: userSchedules.length,
        completionRate,
        upcomingDues,
        recentCollections: completedSchedules.slice(0, 5),
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleCollectPayment = (loanId) => {
    Alert.alert(
      'Collect Payment',
      `Navigate to collection screen for Loan #${loanId}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Collect', onPress: () => console.log('Navigate to collect screen') }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const DueItem = ({ item }) => (
    <View style={styles.dueItem}>
      <View style={styles.dueInfo}>
        <Text style={styles.dueDate}>{formatDate(item.due_date)}</Text>
        <Text style={styles.dueAmount}>{formatCurrency(item.total_due)}</Text>
        <Text style={styles.loanId}>Loan #{item.loan}</Text>
      </View>
      <TouchableOpacity
        style={styles.collectButton}
        onPress={() => handleCollectPayment(item.loan)}
      >
        <Icon name="payment" size={20} color="white" />
        <Text style={styles.collectButtonText}>Collect</Text>
      </TouchableOpacity>
    </View>
  );

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
          <Text style={styles.userName}>{user?.username || 'Agent'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Today's Collection"
          value={formatCurrency(dashboardData.todayCollection)}
          icon="payments"
          color="#10b981"
          subtitle="Collected today"
        />
        <StatCard
          title="Pending Dues"
          value={formatCurrency(dashboardData.pendingDues)}
          icon="schedule"
          color="#f59e0b"
          subtitle="Amount pending"
        />
        <StatCard
          title="Overdue Loans"
          value={dashboardData.overdueLoans}
          icon="warning"
          color="#ef4444"
          subtitle="Loans overdue"
        />
        <StatCard
          title="Completion Rate"
          value={`${dashboardData.completionRate}%`}
          icon="trending-up"
          color="#3b82f6"
          subtitle="Collection rate"
        />
      </View>

      {/* Upcoming Dues */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Dues</Text>
        {dashboardData.upcomingDues.length > 0 ? (
          <FlatList
            data={dashboardData.upcomingDues}
            renderItem={DueItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="check-circle" size={48} color="#10b981" />
            <Text style={styles.emptyText}>No upcoming dues</Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
            <Icon name="assignment" size={24} color="white" />
            <Text style={styles.actionText}>Assigned Loans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}>
            <Icon name="schedule" size={24} color="white" />
            <Text style={styles.actionText}>Pending Collections</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]}>
            <Icon name="history" size={24} color="white" />
            <Text style={styles.actionText}>Collection History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#8b5cf6' }]} onPress={fetchDashboardData}>
            <Icon name="refresh" size={24} color="white" />
            <Text style={styles.actionText}>Refresh Data</Text>
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
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1e293b',
  },
  dueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  dueInfo: {
    flex: 1,
  },
  dueDate: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  loanId: {
    fontSize: 12,
    color: '#64748b',
  },
  collectButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
  },
  collectButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  quickActions: {
    padding: 16,
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
    textAlign: 'center',
  },
});

export default AgentDashboard;