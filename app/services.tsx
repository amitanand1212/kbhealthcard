import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants';
import { useAppStore } from '../src/store';

const iconMap = {
  'hospital-box': 'hospital-box',
  'test-tube': 'test-tube',
  'pill': 'pill',
  'heart-pulse': 'heart-pulse',
  'radiology-box': 'radiology-box',
  'ambulance': 'ambulance',
};

const ServiceCard = ({ service, index }) => {
  const colors = [COLORS.primary, COLORS.secondary, '#9C27B0', COLORS.accent, '#FF9800', COLORS.emergency];
  const cardColor = colors[index % colors.length];

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: cardColor }]}>
        <MaterialCommunityIcons
          name={iconMap[service.icon] || 'medical-bag'}
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

export default function ServicesScreen() {
  const services = useAppStore((state) => state.services);

  return (
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
            <Text style={styles.emptyText}>No services available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight + '20',
    padding: 16,
    margin: 16,
    marginBottom: 0,
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
  },
});
