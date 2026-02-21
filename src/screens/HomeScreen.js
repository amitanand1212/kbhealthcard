import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useAppStore } from '../store';

const { width } = Dimensions.get('window');

const MenuButton = ({ icon, title, subtitle, onPress, color = COLORS.primary }) => (
  <TouchableOpacity style={styles.menuButton} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>
      <MaterialCommunityIcons name={icon} size={28} color={COLORS.white} />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);
  const [pressCount, setPressCount] = useState(0);
  const pressTimer = useRef(null);

  // Hidden Admin Access - Long press logo 5 times
  const handleLogoPress = () => {
    setPressCount((prev) => prev + 1);

    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }

    pressTimer.current = setTimeout(() => {
      setPressCount(0);
    }, 3000);

    if (pressCount >= 4) {
      setPressCount(0);
      navigation.navigate('AdminLogin');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress} activeOpacity={0.8}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <Text style={styles.hospitalName}>
          {hospitalInfo?.name || 'KB Memorial Hospital'}
        </Text>
        <Text style={styles.tagline}>
          {hospitalInfo?.tagline || 'Care With Compassion'}
        </Text>
      </View>

      {/* Menu Options */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <MenuButton
          icon="doctor"
          title="Our Doctors"
          subtitle="View doctor profiles & timings"
          onPress={() => navigation.navigate('Doctors')}
          color={COLORS.primary}
        />

        <MenuButton
          icon="hospital-building"
          title="Hospital Services"
          subtitle="Explore our facilities"
          onPress={() => navigation.navigate('Services')}
          color={COLORS.secondary}
        />

        <MenuButton
          icon="card-account-details"
          title="Senior Citizen Health Card"
          subtitle="Apply for special benefits"
          onPress={() => navigation.navigate('HealthCardInfo')}
          color="#9C27B0"
        />

        <MenuButton
          icon="phone-alert"
          title="Emergency Call"
          subtitle="24×7 emergency helpline"
          onPress={() => navigation.navigate('Emergency')}
          color={COLORS.emergency}
        />

        <MenuButton
          icon="map-marker"
          title="Contact & Location"
          subtitle="Find us & get directions"
          onPress={() => navigation.navigate('Contact')}
          color="#FF9800"
        />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 KB Memorial Hospital</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
  },
  hospitalName: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
  },
  tagline: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 5,
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 15,
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
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
});

export default HomeScreen;
