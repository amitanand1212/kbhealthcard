import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../src/constants';
import { useAppStore } from '../src/store';
import { Alert } from '../src/utils/alert';

export default function EmergencyScreen() {
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);
  const emergencyNumber = hospitalInfo?.contact?.emergency || '9262706867';

  const handleCall = () => {
    const phoneUrl = `tel:${emergencyNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Phone call is not supported on this device');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Could not make the call');
      });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.iconContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Emergency Text */}
      <Text style={styles.title}>Emergency Helpline</Text>
      <Text style={styles.subtitle}>Available 24 × 7</Text>

      {/* Phone Number */}
      <Text style={styles.phoneNumber}>{emergencyNumber}</Text>

      {/* Call Button */}
      <TouchableOpacity
        style={styles.callButton}
        onPress={handleCall}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="phone" size={32} color={COLORS.white} />
        <Text style={styles.callButtonText}>Call Now</Text>
      </TouchableOpacity>

      {/* Info Cards */}
      <View style={styles.infoContainer}>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="ambulance" size={24} color={COLORS.emergency} />
          <Text style={styles.infoText}>Ambulance Service</Text>
        </View>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="hospital-box" size={24} color={COLORS.emergency} />
          <Text style={styles.infoText}>24×7 Emergency</Text>
        </View>
      </View>

      {/* Note */}
      <View style={styles.noteContainer}>
        <MaterialCommunityIcons name="information" size={20} color={COLORS.textSecondary} />
        <Text style={styles.noteText}>
          For medical emergencies, please call immediately. Our team is ready to assist you round the clock.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.emergency,
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.h4,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 5,
  },
  phoneNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
    letterSpacing: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 30,
  },
  callButtonText: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.emergency,
    marginLeft: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginHorizontal: 8,
    alignItems: 'center',
    minWidth: 130,
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    marginTop: 8,
    fontWeight: '500',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginTop: 'auto',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 10,
    lineHeight: 18,
  },
});
