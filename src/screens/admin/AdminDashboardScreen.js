import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAppStore } from '../../store';

const StatCard = ({ title, value, icon, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <View style={styles.statContent}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  </View>
);

const MenuCard = ({ title, subtitle, icon, onPress, color }) => (
  <TouchableOpacity style={styles.menuCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIconContainer, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={28} color={COLORS.white} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuSubtitle}>{subtitle}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

const AdminDashboardScreen = ({ navigation }) => {
  const { cardRequests, healthCards, adminLogout } = useAppStore();

  const pendingRequests = cardRequests.filter((r) => r.status === 'pending').length;
  const totalRequests = cardRequests.length;
  const totalCards = healthCards.length;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          adminLogout();
          navigation.replace('Home');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Admin Dashboard</Text>
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatCard
            title="Pending Requests"
            value={pendingRequests}
            icon="file-clock"
            color={COLORS.warning}
          />
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

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <MenuCard
            title="View Requests"
            subtitle="Review and approve card requests"
            icon="file-document-edit"
            color={COLORS.primary}
            onPress={() => navigation.navigate('AdminRequests')}
          />

          <MenuCard
            title="Create Health Card"
            subtitle="Create a new health card manually"
            icon="card-plus"
            color={COLORS.secondary}
            onPress={() => navigation.navigate('AdminCreateCard')}
          />

          <MenuCard
            title="Send Notification"
            subtitle="Send push notification to users"
            icon="bell-ring"
            color={COLORS.accent}
            onPress={() => Alert.alert('Coming Soon', 'Push notifications will be added with Firebase')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statsContainer: {
    padding: 16,
  },
  statCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  statTitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  menuCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  menuSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default AdminDashboardScreen;
