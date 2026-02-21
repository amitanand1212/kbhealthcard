import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';

const BenefitCard = ({ benefit }: { benefit: any }) => (
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

export default function HealthCardTab() {
  const healthCardBenefits = useAppStore((state) => state.healthCardBenefits);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Dummy Health Card Preview */}
      <View style={styles.cardPreviewSection}>
        <View style={styles.dummyCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardLogoCircle}>
              <Image source={require('../../assets/logo.png')} style={styles.cardLogo} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardHospitalName}>KB MEMORIAL HOSPITAL</Text>
              <Text style={styles.cardHospitalAddress}>Baheri, Darbhanga, Bihar</Text>
            </View>
          </View>

          {/* Red Strip */}
          <View style={styles.cardTypeStrip}>
            <Text style={styles.cardTypeText}>SENIOR CITIZEN HEALTH CARD</Text>
          </View>

          {/* Card Body with Photo */}
          <View style={styles.cardBody}>
            <View style={styles.photoPlaceholder}>
              <MaterialCommunityIcons name="account" size={40} color={COLORS.primary} />
            </View>
            <View style={styles.dummyDetails}>
              <Text style={styles.dummyLabel}>Card No : <Text style={styles.dummyValue}>KBMH-SC-XXXXX</Text></Text>
              <Text style={styles.dummyLabel}>Name : <Text style={styles.dummyValue}>Your Name</Text></Text>
              <Text style={styles.dummyLabel}>Age/Sex : <Text style={styles.dummyValue}>60+ / M</Text></Text>
              <Text style={styles.dummyLabel}>Blood Gr : <Text style={styles.dummyValueRed}>O+</Text></Text>
            </View>
          </View>

          {/* Validity Strip */}
          <View style={styles.validityStrip}>
            <Text style={styles.validityStripText}>Validity: Lifetime</Text>
          </View>
        </View>
      </View>

    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.heroTitle}>{healthCardBenefits?.title || 'Senior Citizen Health Card'}</Text>
        <Text style={styles.heroSubtitle}>{healthCardBenefits?.subtitle || 'Special benefits for senior citizens aged 60+'}</Text>
      </View>

      {/* Benefits Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Benefits</Text>
        {healthCardBenefits?.benefits?.map((benefit: any) => (
          <BenefitCard key={benefit.id} benefit={benefit} />
        ))}
      </View>

      {/* Eligibility Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eligibility</Text>
        <View style={styles.eligibilityCard}>
          {healthCardBenefits?.eligibility?.map((item: string, index: number) => (
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
  cardPreviewSection: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dummyCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#1E88E5',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  cardLogoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardLogo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardHospitalName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardHospitalAddress: {
    fontSize: 9,
    color: COLORS.white,
    opacity: 0.9,
  },
  cardTypeStrip: {
    backgroundColor: '#C62828',
    paddingVertical: 6,
    alignItems: 'center',
  },
  cardTypeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardBody: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  photoPlaceholder: {
    width: 60,
    height: 70,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dummyDetails: {
    flex: 1,
  },
  dummyLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  dummyValue: {
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dummyValueRed: {
    fontWeight: 'bold',
    color: '#C62828',
  },
  validityStrip: {
    backgroundColor: '#8B0000',
    paddingVertical: 6,
    alignItems: 'center',
  },
  validityStripText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  titleSection: {
    padding: 20,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
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
