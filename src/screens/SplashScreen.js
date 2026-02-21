import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SIZES } from '../constants';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to Home after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Hospital Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Image source={require('../../assets/logo.png')} style={styles.logoImage} />
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
};

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
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    fontSize: SIZES.h4,
    color: COLORS.white,
    opacity: 0.9,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 60,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    opacity: 0.5,
    marginHorizontal: 5,
  },
  loadingDotMiddle: {
    opacity: 0.8,
  },
});

export default SplashScreen;
