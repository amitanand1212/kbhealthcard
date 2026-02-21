import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';
import { Alert } from '../../src/utils/alert';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon as any} size={32} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

export default function AdminTab() {
  const { cardRequests, healthCards, adminLogout, adminUser, isAdminLoggedIn } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  // If not admin, show access denied
  if (!isAdminLoggedIn) {
    return (
      <SafeAreaView style={styles.accessDenied} edges={['top']}>
        <MaterialCommunityIcons name="shield-lock" size={64} color={COLORS.textSecondary} />
        <Text style={styles.accessDeniedTitle}>Admin Access Required</Text>
        <Text style={styles.accessDeniedText}>Please login as admin to access this panel.</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.push('/admin/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginBtnText}>Go to Admin Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const pendingRequests = cardRequests.filter((r: any) => r.status === 'pending' || !r.status);
  const approvedRequests = cardRequests.filter((r: any) => r.status === 'approved');
  const totalRequests = cardRequests.length;
  const totalCards = healthCards.length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout from admin panel?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await adminLogout();
          // Stay on tabs, user becomes public user
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.adminInfo}>
            <View style={styles.adminAvatar}>
              <MaterialCommunityIcons name="shield-account" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome, Admin</Text>
              <Text style={styles.adminName}>{adminUser?.name || 'Administrator'}</Text>
              <Text style={styles.adminMobile}>+91 {adminUser?.mobile}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={22} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            title="Total Requests"
            value={totalRequests}
            icon="file-document-multiple"
            color={COLORS.primary}
          />
          <StatCard
            title="Cards Created"
            value={totalCards}
            icon="card-account-details"
            color={COLORS.success}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Pending"
            value={pendingRequests.length}
            icon="clock-outline"
            color={COLORS.warning}
          />
          <StatCard
            title="Approved"
            value={approvedRequests.length}
            icon="check-circle"
            color={COLORS.success}
          />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/admin/requests')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.primary + '15' }]}>
            <MaterialCommunityIcons name="file-document-multiple" size={28} color={COLORS.primary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Card Requests</Text>
            <Text style={styles.actionSubtitle}>
              {pendingRequests.length} pending requests
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/admin/create-card')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.success + '15' }]}>
            <MaterialCommunityIcons name="card-plus" size={28} color={COLORS.success} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Create Health Card</Text>
            <Text style={styles.actionSubtitle}>Create a new health card</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/admin/all-cards')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary + '15' }]}>
            <MaterialCommunityIcons name="cards" size={28} color={COLORS.secondary} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>All Health Cards</Text>
            <Text style={styles.actionSubtitle}>{totalCards} cards created</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/admin/dashboard')}
          activeOpacity={0.8}
        >
          <View style={[styles.actionIcon, { backgroundColor: COLORS.accent + '15' }]}>
            <MaterialCommunityIcons name="view-dashboard" size={28} color={COLORS.accent} />
          </View>
          <View style={styles.actionInfo}>
            <Text style={styles.actionTitle}>Full Dashboard</Text>
            <Text style={styles.actionSubtitle}>Open detailed admin dashboard</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Logout Button at bottom */}
        <TouchableOpacity
          style={styles.logoutButtonFull}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="logout" size={20} color={COLORS.white} />
          <Text style={styles.logoutButtonFullText}>Logout from Admin</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  welcomeText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.8,
  },
  adminName: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  adminMobile: {
    fontSize: SIZES.tiny,
    color: COLORS.white,
    opacity: 0.7,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '600',
    marginLeft: 6,
  },
  scrollContent: {
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: SIZES.tiny,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  statValue: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logoutButtonFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.error,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  logoutButtonFullText: {
    color: COLORS.white,
    fontSize: SIZES.h4,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Access Denied Styles
  accessDenied: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  accessDeniedTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 16,
  },
  accessDeniedText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 25,
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: SIZES.h4,
    fontWeight: '700',
  },
});
