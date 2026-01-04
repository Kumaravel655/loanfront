import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import AdminDashboard from '../screens/dashboards/AdminDashboard';
import AgentDashboard from '../screens/dashboards/AgentDashboard';
import ManagerDashboard from '../screens/dashboards/ManagerDashboard';
import LoadingScreen from '../screens/auth/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard': iconName = 'home'; break;
          case 'Loans': iconName = 'card'; break;
          case 'Customers': iconName = 'people'; break;
          case 'Reports': iconName = 'bar-chart'; break;
          case 'Settings': iconName = 'settings'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={AdminDashboard} />
    <Tab.Screen name="Loans" component={AdminDashboard} />
    <Tab.Screen name="Customers" component={AdminDashboard} />
    <Tab.Screen name="Reports" component={AdminDashboard} />
    <Tab.Screen name="Settings" component={AdminDashboard} />
  </Tab.Navigator>
);

// Agent Tab Navigator
const AgentTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard': iconName = 'home'; break;
          case 'Assigned': iconName = 'list'; break;
          case 'Collections': iconName = 'card'; break;
          case 'History': iconName = 'time'; break;
          case 'Profile': iconName = 'person'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={AgentDashboard} />
    <Tab.Screen name="Assigned" component={AgentDashboard} />
    <Tab.Screen name="Collections" component={AgentDashboard} />
    <Tab.Screen name="History" component={AgentDashboard} />
    <Tab.Screen name="Profile" component={AgentDashboard} />
  </Tab.Navigator>
);

// Staff Tab Navigator
const StaffTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        switch (route.name) {
          case 'Dashboard': iconName = 'home'; break;
          case 'Agents': iconName = 'people'; break;
          case 'Reports': iconName = 'bar-chart'; break;
          case 'Performance': iconName = 'trending-up'; break;
          case 'Profile': iconName = 'person'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#667eea',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={ManagerDashboard} />
    <Tab.Screen name="Agents" component={ManagerDashboard} />
    <Tab.Screen name="Reports" component={ManagerDashboard} />
    <Tab.Screen name="Performance" component={ManagerDashboard} />
    <Tab.Screen name="Profile" component={ManagerDashboard} />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          {user?.role === 'master_admin' && (
            <Stack.Screen name="AdminApp" component={AdminTabs} />
          )}
          {user?.role === 'collection_agent' && (
            <Stack.Screen name="AgentApp" component={AgentTabs} />
          )}
          {user?.role === 'staff' && (
            <Stack.Screen name="StaffApp" component={StaffTabs} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;