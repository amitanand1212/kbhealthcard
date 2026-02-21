import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Image } from 'react-native';
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

const ContactScreen = () => {
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
    const url = hospitalInfo?.location?.googleMapsUrl || 'https://maps.google.com/?q=KB+Memorial+Hospital';
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open maps');
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Logo Header */}
      <View style={styles.logoHeaderContainer}>
        <LogoHeader />
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <MaterialCommunityIcons name="map-marker-radius" size={60} color={COLORS.primary} />
        <Text style={styles.mapText}>KB Memorial Hospital</Text>
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
          {hospitalInfo?.address?.line1 || 'KB Memorial Hospital'}{'\n'}
          {hospitalInfo?.address?.line2 || 'Main Road, City Center'}{'\n'}
          {hospitalInfo?.address?.city || 'Your City'}, {hospitalInfo?.address?.state || 'Your State'}{'\n'}
          PIN: {hospitalInfo?.address?.pincode || '123456'}
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

      {/* Timings Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="clock" size={24} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Timings</Text>
        </View>
        <View style={styles.timingRow}>
          <Text style={styles.timingLabel}>OPD Hours</Text>
          <Text style={styles.timingValue}>{hospitalInfo?.timings?.opd || '9:00 AM - 9:00 PM'}</Text>
        </View>
        <View style={styles.timingRow}>
          <Text style={styles.timingLabel}>Emergency</Text>
          <Text style={[styles.timingValue, { color: COLORS.success }]}>
            {hospitalInfo?.timings?.emergency || '24 x 7'}
          </Text>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  logoHeaderContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  logoHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: SIZES.h4,
    color: COLORS.primary,
    marginTop: 10,
    fontWeight: '600',
  },
  directionsButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 15,
    alignItems: 'center',
  },
  directionsText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
    marginLeft: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginBottom: 0,
    padding: 16,
    borderRadius: SIZES.radius,
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
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  contactValue: {
    fontSize: SIZES.h4,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginTop: 2,
  },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  timingLabel: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  timingValue: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
});

export default ContactScreen;
