import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants';

// Public Screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import DoctorsScreen from '../screens/DoctorsScreen';
import ServicesScreen from '../screens/ServicesScreen';
import HealthCardInfoScreen from '../screens/HealthCardInfoScreen';
import HealthCardRequestScreen from '../screens/HealthCardRequestScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import ContactScreen from '../screens/ContactScreen';

// Admin Screens
import AdminLoginScreen from '../screens/admin/AdminLoginScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminRequestsScreen from '../screens/admin/AdminRequestsScreen';
import AdminCreateCardScreen from '../screens/admin/AdminCreateCardScreen';

const Stack = createNativeStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
  },
  headerTintColor: COLORS.white,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  headerBackTitleVisible: false,
  animation: 'slide_from_right',
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={defaultScreenOptions}
      >
        {/* Splash Screen - No Header */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Home Screen */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Public Screens */}
        <Stack.Screen
          name="Doctors"
          component={DoctorsScreen}
          options={{ title: 'Our Doctors' }}
        />

        <Stack.Screen
          name="Services"
          component={ServicesScreen}
          options={{ title: 'Hospital Services' }}
        />

        <Stack.Screen
          name="HealthCardInfo"
          component={HealthCardInfoScreen}
          options={{ title: 'Health Card' }}
        />

        <Stack.Screen
          name="HealthCardRequest"
          component={HealthCardRequestScreen}
          options={{ title: 'Apply for Health Card' }}
        />

        <Stack.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{ 
            title: 'Emergency',
            headerStyle: {
              backgroundColor: COLORS.emergency,
            },
          }}
        />

        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{ title: 'Contact & Location' }}
        />

        {/* Admin Screens */}
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{ 
            title: 'Admin Login',
            headerStyle: {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ 
            title: 'Admin Dashboard',
            headerStyle: {
              backgroundColor: COLORS.primaryDark,
            },
            headerLeft: () => null, // Disable back button
          }}
        />

        <Stack.Screen
          name="AdminRequests"
          component={AdminRequestsScreen}
          options={{ 
            title: 'Card Requests',
            headerStyle: {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        />

        <Stack.Screen
          name="AdminCreateCard"
          component={AdminCreateCardScreen}
          options={{ 
            title: 'Create Health Card',
            headerStyle: {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
