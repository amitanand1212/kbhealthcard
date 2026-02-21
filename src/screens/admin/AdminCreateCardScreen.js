import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAppStore } from '../../store';

const AdminCreateCardScreen = ({ navigation, route }) => {
  const { request } = route.params || {};
  const addHealthCard = useAppStore((state) => state.addHealthCard);

  const generateCardNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `KBMH-${year}-${random}`;
  };

  const [formData, setFormData] = useState({
    cardNumber: generateCardNumber(),
    name: request?.name || '',
    age: request?.age || '',
    gender: 'Male',
    address: request?.address || '',
    bloodGroup: '',
    mobile: request?.mobile || '',
    validity: 'Lifetime',
  });

  const [errors, setErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.age.trim()) newErrors.age = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    Alert.alert(
      'Create Health Card',
      `Create card for ${formData.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create',
          onPress: async () => {
            setIsCreating(true);
            try {
              await addHealthCard({
                ...formData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
              });
              setIsCreating(false);
              Alert.alert('Success', 'Health card created successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              setIsCreating(false);
              Alert.alert('Error', 'Failed to create health card. Please try again.');
            }
          },
        },
      ]
    );
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardHeader}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.cardTitle}>KB Memorial Hospital</Text>
              <Text style={styles.cardSubtitle}>Senior Citizen Health Card</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardNumber}>{formData.cardNumber}</Text>
            <Text style={styles.cardName}>{formData.name || 'Name'}</Text>
            <Text style={styles.cardDetails}>
              {formData.age || '--'} yrs | {formData.gender} | {formData.bloodGroup || 'Blood Group'}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.validityText}>Validity: {formData.validity}</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Card Number (Auto) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.autoField}>
              <MaterialCommunityIcons name="credit-card" size={20} color={COLORS.success} />
              <Text style={styles.autoFieldText}>{formData.cardNumber}</Text>
              <Text style={styles.autoTag}>Auto</Text>
            </View>
          </View>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter name"
              value={formData.name}
              onChangeText={(text) => updateField('name', text)}
            />
          </View>

          {/* Age & Gender Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Age"
                value={formData.age}
                onChangeText={(text) => updateField('age', text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1.5 }]}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.chipContainer}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, formData.gender === g && styles.chipSelected]}
                    onPress={() => updateField('gender', g)}
                  >
                    <Text style={[styles.chipText, formData.gender === g && styles.chipTextSelected]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Blood Group */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Blood Group *</Text>
            <View style={styles.chipContainer}>
              {bloodGroups.map((bg) => (
                <TouchableOpacity
                  key={bg}
                  style={[styles.chip, formData.bloodGroup === bg && styles.chipSelected]}
                  onPress={() => updateField('bloodGroup', bg)}
                >
                  <Text style={[styles.chipText, formData.bloodGroup === bg && styles.chipTextSelected]}>
                    {bg}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.bloodGroup && <Text style={styles.errorText}>{errors.bloodGroup}</Text>}
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.address && styles.inputError]}
              placeholder="Enter address"
              value={formData.address}
              onChangeText={(text) => updateField('address', text)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Mobile */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={[styles.input, errors.mobile && styles.inputError]}
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChangeText={(text) => updateField('mobile', text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Validity (Auto) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Validity</Text>
            <View style={styles.autoField}>
              <MaterialCommunityIcons name="infinity" size={20} color={COLORS.success} />
              <Text style={styles.autoFieldText}>Lifetime</Text>
              <Text style={styles.autoTag}>Auto</Text>
            </View>
          </View>

          {/* Note about photo/aadhaar */}
          <View style={styles.noteContainer}>
            <MaterialCommunityIcons name="information" size={18} color={COLORS.primary} />
            <Text style={styles.noteText}>
              Photo and Aadhaar upload will be available after Firebase integration.
            </Text>
          </View>

          {/* Save Button */}
          {isCreating && (
            <View style={styles.creatingMessage}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.creatingText}>Please wait, creating health card...</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.saveButton, isCreating && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} />
                <Text style={styles.saveButtonText}>Creating...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="content-save" size={22} color={COLORS.white} />
                <Text style={styles.saveButtonText}>Save Health Card</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  cardPreview: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    backgroundColor: COLORS.primaryDark,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  cardSubtitle: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  cardBody: {
    padding: 16,
  },
  cardNumber: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.8,
    letterSpacing: 1,
  },
  cardName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 8,
  },
  cardDetails: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  cardFooter: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
  },
  validityText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    textAlign: 'center',
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: 14,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  autoField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.success,
    borderRadius: SIZES.radius,
    padding: 14,
  },
  autoFieldText: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 10,
  },
  autoTag: {
    fontSize: SIZES.tiny,
    color: COLORS.success,
    fontWeight: '600',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  chipTextSelected: {
    color: COLORS.white,
    fontWeight: '600',
  },
  errorText: {
    fontSize: SIZES.small,
    color: COLORS.error,
    marginTop: 4,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.primaryLight + '15',
    padding: 12,
    borderRadius: SIZES.radius,
    marginBottom: 20,
  },
  noteText: {
    flex: 1,
    marginLeft: 10,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.success,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 10,
  },
  creatingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    padding: 12,
    backgroundColor: COLORS.primary + '15',
    borderRadius: SIZES.radius,
  },
  creatingText: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default AdminCreateCardScreen;
