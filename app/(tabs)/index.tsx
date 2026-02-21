import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';

const QuickAction = ({ icon, title, onPress, color = COLORS.primary }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickIcon, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={24} color={COLORS.white} />
    </View>
    <Text style={styles.quickTitle}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeTab() {
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);
  const refreshData = useAppStore((state) => state.refreshData);
  const isRefreshing = useAppStore((state) => state.isRefreshing);
  const [pressCount, setPressCount] = useState(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hidden Admin Access - Long press logo 5 times
  const handleLogoPress = () => {
    setPressCount((prev) => prev + 1);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    pressTimer.current = setTimeout(() => {
      setPressCount(0);
    }, 3000);

    if (pressCount >= 4) {
      setPressCount(0);
      router.push('/admin/login');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.8}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.hospitalName}>
          {hospitalInfo?.name || 'KB Memorial Hospital'}
        </Text>
        <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
        <Text style={styles.tagline}>
          {hospitalInfo?.tagline || 'Care With Compassion'}
        </Text>
      </View>

      {/* Quick Actions */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon="phone-alert"
            title="Emergency"
            onPress={() => router.push('/emergency')}
            color={COLORS.emergency}
          />
          <QuickAction
            icon="map-marker"
            title="Contact"
            onPress={() => router.push('/contact')}
            color={COLORS.accent}
          />
          <QuickAction
            icon="file-document-edit"
            title="Apply Card"
            onPress={() => router.push('/health-card-request')}
            color="#9C27B0"
          />
          <QuickAction
            icon="information"
            title="About Us"
            onPress={() => router.push('/contact')}
            color={COLORS.secondary}
          />
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <MaterialCommunityIcons name="hospital-building" size={40} color={COLORS.primary} />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome to KB Memorial Hospital</Text>
            <Text style={styles.welcomeSubtitle}>
              Your trusted healthcare partner. Explore our services using the tabs below.
            </Text>
          </View>
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity 
          style={styles.emergencyBanner}
          onPress={() => router.push('/emergency')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="ambulance" size={32} color={COLORS.white} />
          <View style={styles.emergencyText}>
            <Text style={styles.emergencyTitle}>24×7 Emergency Services</Text>
            <Text style={styles.emergencyNumber}>
              Call: {hospitalInfo?.contact?.emergency || '9262706867'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 KB Memorial Hospital</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logoContainer: {
    width: SIZES.logo + 20,
    height: SIZES.logo + 20,
    borderRadius: (SIZES.logo + 20) / 2,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: SIZES.logo,
    height: SIZES.logo,
    resizeMode: 'contain',
  },
  hospitalName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  hospitalAddress: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  tagline: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAction: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickTitle: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  welcomeCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeText: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emergencyBanner: {
    backgroundColor: COLORS.emergency,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  emergencyText: {
    flex: 1,
    marginLeft: 12,
  },
  emergencyTitle: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emergencyNumber: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 2,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
});
