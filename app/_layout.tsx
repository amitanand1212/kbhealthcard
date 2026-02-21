import React, { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '../src/store';
import { COLORS } from '../src/constants';

// Prevent auto-hide splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initializeData, cleanup } = useAppStore();

  // Load icon fonts for web
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    // Initialize store with Firebase data (falls back to local JSON)
    const loadData = async () => {
      await initializeData();
      SplashScreen.hideAsync();
    };
    loadData();

    // Cleanup real-time listeners on unmount
    return () => cleanup();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="doctors" options={{ title: 'Our Doctors' }} />
          <Stack.Screen name="services" options={{ title: 'Hospital Services' }} />
          <Stack.Screen name="health-card-info" options={{ title: 'Health Card' }} />
          <Stack.Screen name="health-card-request" options={{ headerShown: false }} />
          <Stack.Screen
            name="emergency"
            options={{
              title: 'Emergency',
              headerStyle: { backgroundColor: COLORS.emergency },
            }}
          />
          <Stack.Screen name="contact" options={{ title: 'Contact & Location' }} />
          <Stack.Screen
            name="admin/login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/dashboard"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/requests"
            options={{
              title: 'Card Requests',
              headerStyle: { backgroundColor: COLORS.primaryDark },
            }}
          />
          <Stack.Screen
            name="admin/create-card"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/card-preview"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="admin/all-cards"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
