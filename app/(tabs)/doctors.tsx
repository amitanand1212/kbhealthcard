import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';

const DoctorCard = ({ doctor }: { doctor: any }) => (
  <View style={styles.card}>
    {/* Doctor Photo Placeholder */}
    <View style={styles.photoContainer}>
      <View style={styles.photoPlaceholder}>
        <MaterialCommunityIcons name="doctor" size={40} color={COLORS.primary} />
      </View>
    </View>

    {/* Doctor Info */}
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.degree}>{doctor.degree}</Text>
      
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="hospital-building" size={16} color={COLORS.secondary} />
        <Text style={styles.detailText}>{doctor.department}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="briefcase" size={16} color={COLORS.primary} />
        <Text style={styles.detailText}>{doctor.experience} Experience</Text>
      </View>
      
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.accent} />
        <Text style={styles.detailText}>OPD: {doctor.opdTiming}</Text>
      </View>

      {doctor.specialization && (
        <View style={styles.specializationContainer}>
          <Text style={styles.specializationText}>{doctor.specialization}</Text>
        </View>
      )}
    </View>
  </View>
);

export default function DoctorsTab() {
  const doctors = useAppStore((state) => state.doctors);
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
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="doctor" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>No doctors available</Text>
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
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoContainer: {
    marginRight: 16,
  },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  degree: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  specializationContainer: {
    backgroundColor: COLORS.primaryLight + '30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  specializationText: {
    fontSize: SIZES.tiny,
    color: COLORS.primary,
    fontWeight: '500',
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
