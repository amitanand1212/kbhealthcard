import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants';
import { useAppStore } from '../src/store';
import { Alert } from '../src/utils/alert';

export default function ContactScreen() {
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Error', 'Could not make the call');
    });
  };

  const handleWhatsApp = () => {
    const whatsappNumber = hospitalInfo?.contact?.whatsapp || '9262706867';
    const url = `whatsapp://send?phone=91${whatsappNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp is not installed');
    });
  };

  const handleDirections = () => {
    const url = hospitalInfo?.location?.googleMapsUrl || 'https://maps.google.com/?q=KB+Memorial+Hospital+Baheri+Darbhanga+Bihar+Near+SBI+Bank';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps');
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <MaterialCommunityIcons name="map-marker-radius" size={60} color={COLORS.primary} />
        <Text style={styles.mapText}>KB Memorial Hospital</Text>
        <Text style={styles.mapSubText}>Baheri, Darbhanga, Bihar</Text>
        <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
          <MaterialCommunityIcons name="directions" size={20} color={COLORS.white} />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      {/* Address Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="map-marker" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Address</Text>
        </View>
        <Text style={styles.addressText}>
          KB Memorial Hospital{'\n'}
          Baheri, Darbhanga, Bihar{'\n'}
          Near SBI Bank
        </Text>
      </View>

      {/* Contact Options */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="phone" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Contact</Text>
        </View>

        {/* Reception */}
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => handleCall(hospitalInfo?.contact?.reception || '9262706867')}
        >
          <View style={[styles.contactIconBox, { backgroundColor: COLORS.primary }]}>
            <MaterialCommunityIcons name="phone" size={20} color={COLORS.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Reception</Text>
            <Text style={styles.contactValue}>
              {hospitalInfo?.contact?.reception || '9262706867'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* Emergency */}
        <TouchableOpacity
          style={styles.contactRow}
          onPress={() => handleCall(hospitalInfo?.contact?.emergency || '9262706867')}
        >
          <View style={[styles.contactIconBox, { backgroundColor: COLORS.emergency }]}>
            <MaterialCommunityIcons name="phone-alert" size={20} color={COLORS.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Emergency (24×7)</Text>
            <Text style={styles.contactValue}>
              {hospitalInfo?.contact?.emergency || '9262706867'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        {/* WhatsApp */}
        <TouchableOpacity style={styles.contactRow} onPress={handleWhatsApp}>
          <View style={[styles.contactIconBox, { backgroundColor: '#25D366' }]}>
            <MaterialCommunityIcons name="whatsapp" size={20} color={COLORS.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactValue}>
              {hospitalInfo?.contact?.whatsapp || '9262706867'}
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Working Hours */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="clock-outline" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Working Hours</Text>
        </View>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>OPD Timing</Text>
          <Text style={styles.hoursValue}>{hospitalInfo?.timings?.opd || '9:00 AM - 5:00 PM'}</Text>
        </View>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Emergency</Text>
          <Text style={[styles.hoursValue, { color: COLORS.success }]}>24 × 7</Text>
        </View>
        <View style={styles.hoursRow}>
          <Text style={styles.hoursLabel}>Pharmacy</Text>
          <Text style={styles.hoursValue}>{hospitalInfo?.timings?.pharmacy || '8:00 AM - 10:00 PM'}</Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mapPlaceholder: {
    backgroundColor: COLORS.primaryLight + '20',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: SIZES.h4,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 10,
  },
  mapSubText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 16,
  },
  directionsText: {
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    borderRadius: SIZES.radius,
    padding: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  addressText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  contactValue: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hoursLabel: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  hoursValue: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});
