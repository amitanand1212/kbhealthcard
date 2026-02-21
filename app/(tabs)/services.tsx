import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';

const iconMap: Record<string, string> = {
  'hospital-box': 'hospital-box',
  'test-tube': 'test-tube',
  'pill': 'pill',
  'heart-pulse': 'heart-pulse',
  'radiology-box': 'radiology-box',
  'ambulance': 'ambulance',
};

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const colors = [COLORS.primary, COLORS.secondary, '#9C27B0', COLORS.accent, '#FF9800', COLORS.emergency];
  const cardColor = colors[index % colors.length];

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: cardColor }]}>
        <MaterialCommunityIcons
          name={(iconMap[service.icon] || 'medical-bag') as any}
          size={32}
          color={COLORS.white}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.description}>{service.description}</Text>
        <View style={styles.availabilityContainer}>
          <MaterialCommunityIcons name="clock-outline" size={14} color={COLORS.success} />
          <Text style={styles.availabilityText}>{service.available}</Text>
        </View>
      </View>
    </View>
  );
};

export default function ServicesTab() {
  const services = useAppStore((state) => state.services);
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.hospitalName}>{hospitalInfo?.name || 'KB MEMORIAL HOSPITAL'}</Text>
        <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
        <Text style={styles.tagline}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>
      </View>

    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ServiceCard service={item} index={index} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <MaterialCommunityIcons name="hospital-building" size={24} color={COLORS.primary} />
            <Text style={styles.headerText}>
              We provide comprehensive healthcare services with modern facilities
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="hospital-building" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
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
  hospitalName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    padding: 16,
    marginBottom: 8,
    borderRadius: SIZES.radius,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  serviceName: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityText: {
    fontSize: SIZES.small,
    color: COLORS.success,
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
});
