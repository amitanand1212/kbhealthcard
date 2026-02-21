import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
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
      <MaterialCommunityIcons name={icon as any} size={36} color={color} />
    </View>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const RequestCard = ({ request, onApprove, onReject }: any) => (
  <View style={styles.requestCard}>
    <View style={styles.requestHeader}>
      <View style={styles.avatarContainer}>
        <MaterialCommunityIcons name="account" size={30} color={COLORS.primary} />
      </View>
      <View style={styles.requestInfo}>
        <Text style={styles.requestName}>{request.name}</Text>
        <Text style={styles.requestMeta}>
          Age: {request.age} | Mobile Number
        </Text>
        <Text style={styles.requestAddress}>{request.address}</Text>
      </View>
    </View>
    <View style={styles.requestPhone}>
      <MaterialCommunityIcons name="phone" size={16} color={COLORS.primary} />
      <Text style={styles.requestPhoneText}>{request.mobile}</Text>
    </View>
    <View style={styles.requestActions}>
      <TouchableOpacity
        style={[styles.actionButton, styles.approveButton]}
        onPress={() => onApprove(request)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="check" size={16} color={COLORS.white} />
        <Text style={styles.actionButtonText}>Approve</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.rejectButton]}
        onPress={() => onReject(request)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="close" size={16} color={COLORS.white} />
        <Text style={styles.actionButtonText}>Reject</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function AdminDashboardScreen() {
  const { cardRequests, healthCards, adminLogout, updateCardRequest, refreshData, isRefreshing } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  const pendingRequests = cardRequests.filter((r: any) => r.status === 'pending' || !r.status);
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
          // After logout, user becomes public user
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  const handleApprove = (request: any) => {
    Alert.alert('Approve Request', `Approve health card for ${request.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          await updateCardRequest(request.id, { status: 'approved' });
          router.push({ pathname: '/admin/create-card', params: { requestId: request.id } });
        },
      },
    ]);
  };

  const handleReject = (request: any) => {
    Alert.alert('Reject Request', `Reject health card request from ${request.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          await updateCardRequest(request.id, { status: 'rejected' });
          Alert.alert('Rejected', 'Request has been rejected.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshData} colors={[COLORS.primary]} />
        }
      >
        {/* Blue Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogout} style={styles.settingsButton}>
            <MaterialCommunityIcons name="logout" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Text style={styles.hospitalName}>{hospitalInfo?.name || 'KB MEMORIAL HOSPITAL'}</Text>
          <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
          <Text style={styles.tagline}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>

          {/* Admin Dashboard Badge */}
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin Dashboard</Text>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.mainCard}>
          <Text style={styles.cardTitle}>Admin Dashboard</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatCard
              title="Total Card Requests"
              value={totalRequests}
              icon="file-document-multiple"
              color={COLORS.primary}
            />
            <StatCard
              title="Total Cards Created"
              value={totalCards}
              icon="card-account-details"
              color={COLORS.success}
            />
          </View>

          {/* Pending Requests Section */}
          <View style={styles.pendingSection}>
            <Text style={styles.pendingSectionTitle}>Pending Requests</Text>

            {pendingRequests.length > 0 ? (
              <>
                {pendingRequests.slice(0, 2).map((request: any, index: number) => (
                  <RequestCard
                    key={request.id || index}
                    request={request}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                ))}

                {pendingRequests.length > 0 && (
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push('/admin/requests')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewAllText}>View All</Text>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={COLORS.white} />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="check-circle" size={48} color={COLORS.success} />
                <Text style={styles.emptyStateText}>No pending requests</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="home" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Public</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/requests')}
          activeOpacity={0.7}
        >
          <View style={styles.navIconContainer}>
            <MaterialCommunityIcons name="file-document-multiple" size={24} color={COLORS.textSecondary} />
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length > 9 ? '9+' : pendingRequests.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/create-card')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="card-plus" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/admin/all-cards')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="cards" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>All Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={24} color={COLORS.error} />
          <Text style={[styles.navText, { color: COLORS.error }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
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
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
  },
  hospitalAddress: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  hospitalName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  adminBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adminBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  mainCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
  },
  pendingSection: {
    marginTop: 8,
  },
  pendingSectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  requestCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  requestMeta: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  requestAddress: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  requestPhone: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestPhoneText: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '600',
    marginLeft: 4,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
    marginRight: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    position: 'relative',
  },
  navText: {
    fontSize: SIZES.tiny,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
