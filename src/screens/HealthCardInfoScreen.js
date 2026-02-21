import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';
import { useAppStore } from '../store';

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

const HealthCardInfoScreen = ({ navigation }) => {
  const healthCardBenefits = useAppStore((state) => state.healthCardBenefits);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.cardPreview}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.heroLogo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.heroTitle}>{healthCardBenefits?.title || 'Senior Citizen Health Card'}</Text>
        <Text style={styles.heroSubtitle}>{healthCardBenefits?.subtitle || 'Special benefits for senior citizens aged 50+'}</Text>
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
        onPress={() => navigation.navigate('HealthCardRequest')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="file-document-edit" size={24} color={COLORS.white} />
        <Text style={styles.applyButtonText}>Apply for Health Card</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    backgroundColor: COLORS.primary,
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
    padding: 20,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  benefitCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: SIZES.radius,
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
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
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
    padding: 16,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eligibilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eligibilityText: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.secondary + '15',
    borderRadius: SIZES.radius,
  },
  validityText: {
    fontSize: SIZES.h4,
    fontWeight: '600',
    color: COLORS.secondaryDark,
    marginLeft: 10,
  },
  applyButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  applyButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
});

export default HealthCardInfoScreen;
