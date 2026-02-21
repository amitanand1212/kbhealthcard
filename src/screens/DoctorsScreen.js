import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useAppStore } from '../store';

const LogoHeader = () => (
  <View style={styles.logoHeader}>
    <Image
      source={require('../../assets/logo.png')}
      style={styles.headerLogo}
      resizeMode="contain"
    />
  </View>
);

const DoctorCard = ({ doctor }) => (
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

const DoctorsScreen = () => {
  const doctors = useAppStore((state) => state.doctors);

  return (
    <View style={styles.container}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoctorCard doctor={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<LogoHeader />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No doctors available</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoHeader: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
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
    color: COLORS.primary,
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
    backgroundColor: COLORS.secondary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  specializationText: {
    fontSize: SIZES.tiny,
    color: COLORS.secondaryDark,
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

export default DoctorsScreen;
