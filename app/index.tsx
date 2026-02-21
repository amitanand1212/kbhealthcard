import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../src/constants';

export default function SplashScreen() {
  useEffect(() => {
    // Navigate to Tabs after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Hospital Logo Placeholder */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image source={require('../assets/logo.png')} style={styles.logoImage} />
        </View>
      </View>

      {/* Hospital Name */}
      <Text style={styles.hospitalName}>KB Memorial Hospital</Text>

      {/* Tagline */}
      <Text style={styles.tagline}>Care With Compassion</Text>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotMiddle]} />
        <View style={styles.loadingDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  logoImage: {
    width: SIZES.logo,
    height: SIZES.logo,
    resizeMode: 'contain',
  },
  hospitalName: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: SIZES.h4,
    color: COLORS.white,
    opacity: 0.9,
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    marginHorizontal: 4,
    opacity: 0.5,
  },
  loadingDotMiddle: {
    opacity: 0.8,
  },
});
