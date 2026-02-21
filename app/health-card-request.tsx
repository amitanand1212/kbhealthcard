import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../src/constants';
import { useAppStore } from '../src/store';
import { Alert } from '../src/utils/alert';

type FormData = {
  name: string;
  age: string;
  address: string;
  mobile: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function HealthCardRequestScreen() {
  const addCardRequest = useAppStore((state) => state.addCardRequest);
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);
  const healthCardBenefits = useAppStore((state) => state.healthCardBenefits);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    address: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
    } else if (parseInt(formData.age) < 60) {
      newErrors.age = 'Must be 60 years or older';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = 'Enter valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const result = await addCardRequest({
        ...formData,
        submittedAt: new Date().toISOString(),
      });

      if (result) {
        Alert.alert(
          'Request Submitted!',
          'Your health card request has been submitted successfully. You will be contacted soon.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Could not submit request. Please try again.');
      }
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go to Home"
          >
            <MaterialCommunityIcons name="menu" size={26} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/logo.png')} style={styles.headerLogo} />
          </View>
          <Text style={styles.headerTitle}>{hospitalInfo?.name || 'KB Memorial Hospital'}</Text>
          <Text style={styles.headerAddress}>Baheri, Darbhanga, Bihar</Text>
          <Text style={styles.headerSubtitle}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>
        </View>

        {/* Page Title */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>Senior Citizen Health Card Application</Text>
        </View>

        {/* Health Card Preview */}
        <View style={styles.cardPreviewContainer}>
          <View style={styles.cardPreviewHeader}>
            <Image source={require('../assets/logo.png')} style={styles.cardLogo} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardHospitalName}>{hospitalInfo?.name || 'KB Memorial Hospital'}</Text>
              <Text style={styles.cardHospitalAddress}>
                {hospitalInfo?.address?.line2 || hospitalInfo?.address?.line1 || 'Hospital Address'}
              </Text>
            </View>
          </View>

          <View style={styles.cardTypeStrip}>
            <Text style={styles.cardTypeStripText}>SENIOR CITIZEN HEALTH CARD</Text>
          </View>

          <View style={styles.cardPreviewBody}>
            <View style={styles.cardPersonLeft}>
              <View style={styles.cardAvatar}>
                <MaterialCommunityIcons name="account" size={34} color={COLORS.primary} />
              </View>
            </View>

            <View style={styles.cardPersonRight}>
              <Text style={styles.cardPersonName}>{formData.name?.trim() || 'Your Name'}</Text>
              <Text style={styles.cardPersonMeta}>Age: {formData.age || '--'}</Text>
              <Text style={styles.cardPersonMeta}>OPD: {hospitalInfo?.timings?.opd || '9:00 AM - 9:00 PM'}</Text>
            </View>
          </View>

          <View style={styles.cardBottomStrip}>
            <Text style={styles.cardBottomText}>Valid Till : Lifetime</Text>
            <Text style={styles.cardBottomText}>
              Emergency: {hospitalInfo?.contact?.emergency || '—'}
            </Text>
          </View>
        </View>

        {/* Benefits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Card Benefits</Text>
          <View style={styles.benefitsCard}>
            {(healthCardBenefits?.benefits || []).map((benefit) => (
              <View key={benefit.id} style={styles.benefitRow}>
                <MaterialCommunityIcons name="check" size={18} color={COLORS.success} />
                <Text style={styles.benefitText}>{benefit.title}</Text>
              </View>
            ))}
            {!healthCardBenefits?.benefits?.length && (
              <Text style={styles.benefitFallbackText}>
                Benefits will appear here once data is loaded.
              </Text>
            )}
          </View>
        </View>

        {/* Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Form</Text>
          <View style={styles.formCard}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                <MaterialCommunityIcons name="account" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => updateField('name', text)}
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Age + Address (row) */}
            <View style={styles.row}>
              <View style={[styles.col, styles.colLeft]}>
                <View style={[styles.inputContainer, errors.age && styles.inputError]}>
                  <MaterialCommunityIcons name="cake-variant" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Age"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.age}
                    onChangeText={(text) => updateField('age', text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                </View>
                {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
              </View>

              <View style={[styles.col, styles.colRight]}>
                <View style={[styles.inputContainer, errors.address && styles.inputError]}>
                  <MaterialCommunityIcons name="home" size={20} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Address"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.address}
                    onChangeText={(text) => updateField('address', text)}
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
              </View>
            </View>

            {/* Mobile */}
            <View style={styles.inputGroup}>
              <View style={[styles.inputContainer, errors.mobile && styles.inputError]}>
                <MaterialCommunityIcons name="phone" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.mobile}
                  onChangeText={(text) => updateField('mobile', text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
              {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
            </View>

            {/* Submit */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.85}>
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 24,
    paddingBottom: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    right: 20,
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
  headerLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerAddress: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },

  pageTitleContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  pageTitle: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  cardPreviewContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: COLORS.primaryLight + '20',
  },
  cardLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    resizeMode: 'contain',
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardHospitalName: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardHospitalAddress: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cardTypeStrip: {
    backgroundColor: COLORS.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  cardTypeStripText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  cardPreviewBody: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  cardPersonLeft: {
    marginRight: 12,
  },
  cardAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPersonRight: {
    flex: 1,
  },
  cardPersonName: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  cardPersonMeta: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardBottomStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORS.primaryDark,
  },
  cardBottomText: {
    color: COLORS.white,
    fontSize: SIZES.tiny,
    fontWeight: '600',
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  benefitsCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  benefitText: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  benefitFallbackText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },

  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 14,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    paddingVertical: 14,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    flex: 1,
  },
  colLeft: {
    marginRight: 8,
  },
  colRight: {
    marginLeft: 8,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SIZES.small,
    color: COLORS.error,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});
