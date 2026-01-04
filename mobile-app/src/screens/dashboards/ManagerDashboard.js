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

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalAgents: 0,
    totalCollections: 0,
    pendingAssignments: 0,
    teamPerformance: 0,
    topPerformers: [],
    recentActivities: [],
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
      
      const [agents, schedules, collections] = await Promise.all([
        loanService.getCollectionAgents().catch(() => []),
        loanService.getLoanSchedules().catch(() => []),
        loanService.getDailyCollections().catch(() => [])
      ]);
      
      const totalCollections = collections.reduce((sum, c) => sum + parseFloat(c.total_amount || 0), 0);
      const pendingAssignments = schedules.filter(s => !s.assigned_to).length;
      
      // Calculate team performance
      const completedSchedules = schedules.filter(s => s.status === 'done').length;
      const teamPerformance = schedules.length > 0 
        ? Math.round((completedSchedules / schedules.length) * 100)
        : 0;
      
      // Get top performers (mock data for now)
      const topPerformers = agents.slice(0, 3).map((agent, index) => ({
        ...agent,
        collections: Math.floor(Math.random() * 100000) + 50000,
        rank: index + 1
      }));
      
      // Recent activities (mock data)
      const recentActivities = [
        { id: 1, text: 'Agent John collected ₹15,000 from Customer #1234', time: '2 hours ago' },
        { id: 2, text: 'New loan assigned to Agent Sarah', time: '4 hours ago' },
        { id: 3, text: 'Monthly target achieved by Agent Mike', time: '1 day ago' },
      ];
      
      setDashboardData({
        totalAgents: agents.length,
        totalCollections,
        pendingAssignments,
        teamPerformance,
        topPerformers,
        recentActivities,
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

  const handleAssignLoans = () => {
    Alert.alert(
      'Assign Loans',
      'Navigate to loan assignment screen?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Assign', onPress: () => console.log('Navigate to assignment screen') }
      ]
    );
  };

  const StatCard = ({ title, value, icon, color, subtitle, onPress }) => (
    <TouchableOpacity 
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={onPress}
    >
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );

  const PerformerItem = ({ item }) => (
    <View style={styles.performerItem}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{item.rank}</Text>
      </View>
      <View style={styles.performerInfo}>
        <Text style={styles.performerName}>{item.username}</Text>
        <Text style={styles.performerAmount}>{formatCurrency(item.collections)}</Text>
      </View>
      <Icon name="trending-up" size={20} color="#10b981" />
    </View>
  );

  const ActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <Icon name="notifications" size={16} color="#667eea" />
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{item.text}</Text>
        <Text style={styles.activityTime}>{item.time}</Text>
      </View>
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
          <Text style={styles.welcomeText}>Staff Dashboard</Text>
          <Text style={styles.userName}>{user?.username || 'Manager'}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Agents"
          value={dashboardData.totalAgents}
          icon="group"
          color="#3b82f6"
          subtitle="Active agents"
        />
        <StatCard
          title="Total Collections"
          value={formatCurrency(dashboardData.totalCollections)}
          icon="payments"
          color="#10b981"
          subtitle="This month"
        />
        <StatCard
          title="Pending Assignments"
          value={dashboardData.pendingAssignments}
          icon="assignment-late"
          color="#f59e0b"
          subtitle="Need assignment"
          onPress={handleAssignLoans}
        />
        <StatCard
          title="Team Performance"
          value={`${dashboardData.teamPerformance}%`}
          icon="trending-up"
          color="#8b5cf6"
          subtitle="Success rate"
        />
      </View>

      {/* Top Performers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Performers</Text>
        {dashboardData.topPerformers.length > 0 ? (
          <FlatList
            data={dashboardData.topPerformers}
            renderItem={PerformerItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="leaderboard" size={48} color="#64748b" />
            <Text style={styles.emptyText}>No performance data</Text>
          </View>
        )}
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <FlatList
          data={dashboardData.recentActivities}
          renderItem={ActivityItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#3b82f6' }]}>
            <Icon name="group-add" size={24} color="white" />
            <Text style={styles.actionText}>Manage Agents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#10b981' }]} onPress={handleAssignLoans}>
            <Icon name="assignment" size={24} color="white" />
            <Text style={styles.actionText}>Assign Loans</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}>
            <Icon name="assessment" size={24} color="white" />
            <Text style={styles.actionText}>View Reports</Text>
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
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 8,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  performerInfo: {
    flex: 1,
  },
  performerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  performerAmount: {
    fontSize: 14,
    color: '#64748b',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
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

export default ManagerDashboard;