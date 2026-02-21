import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../src/constants';
import { useAppStore } from '../src/store';

const BenefitCard = ({ benefit }) => (
  <View style={styles.benefitCard}>
    <View style={styles.benefitIconContainer}>
      <MaterialCommunityIcons
        name={benefit.icon || 'check-circle'}
        size={24}
        color={COLORS.primary}
      />
    </View>
    <View style={styles.benefitContent}>
      <Text style={styles.benefitTitle}>{benefit.title}</Text>
      <Text style={styles.benefitDescription}>{benefit.description}</Text>
    </View>
  </View>
);

export default function HealthCardInfoScreen() {
  const healthCardBenefits = useAppStore((state) => state.healthCardBenefits);
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.hospitalName}>{hospitalInfo?.name || 'KB MEMORIAL HOSPITAL'}</Text>
        <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
        <Text style={styles.tagline}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>
      </View>

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <MaterialCommunityIcons name="card-account-details" size={60} color={COLORS.primary} />
        <Text style={styles.heroTitle}>{healthCardBenefits?.title || 'Senior Citizen Health Card'}</Text>
        <Text style={styles.heroSubtitle}>{healthCardBenefits?.subtitle || 'Special benefits for senior citizens aged 60+'}</Text>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        {healthCardBenefits?.benefits?.map((benefit) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </View>

      {/* Eligibility Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eligibility</Text>
        <View style={styles.eligibilityCard}>
          {healthCardBenefits?.eligibility?.map((item, index) => (
            <View key={index} style={styles.eligibilityItem}>
              <MaterialCommunityIcons name="check-circle" size={18} color={COLORS.success} />
              <Text style={styles.eligibilityText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Validity */}
      <View style={styles.validityContainer}>
        <MaterialCommunityIcons name="infinity" size={24} color={COLORS.secondary} />
        <Text style={styles.validityText}>Validity: {healthCardBenefits?.validity || 'Lifetime'}</Text>
      </View>

      {/* Apply Button */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => router.push('/health-card-request')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="file-document-edit" size={24} color={COLORS.white} />
        <Text style={styles.applyButtonText}>Apply for Health Card</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 8,
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
  heroSection: {
    backgroundColor: COLORS.primary,
    padding: 30,
    alignItems: 'center',
  },
  cardPreview: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heroLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
  },
  heroTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  benefitCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  eligibilityCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
  },
  eligibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eligibilityText: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 12,
    flex: 1,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  validityText: {
    fontSize: SIZES.h4,
    color: COLORS.secondary,
    fontWeight: '600',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: SIZES.radius,
  },
  applyButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
});
