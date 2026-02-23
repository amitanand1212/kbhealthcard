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
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';
import { uploadImage } from '../../src/firebase/firebaseService';
import { Alert } from '../../src/utils/alert';

type FormData = {
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  address: string;
  mobile: string;
  bloodGroup: string;
  aadharFile: string | null;
  photo: string | null;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function AdminCreateCardScreen() {
  const { requestId } = useLocalSearchParams();
  const { cardRequests, addHealthCard } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  // Find request if coming from approval
  const request: any = requestId ? cardRequests.find((r: any) => r.id === requestId) : null;

  const [formData, setFormData] = useState<FormData>({
    name: request?.name || '',
    age: request?.age || '',
    gender: 'Male',
    address: request?.address || '',
    mobile: request?.mobile || '',
    bloodGroup: '',
    aadharFile: null,
    photo: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.photo) newErrors.photo = 'Photo is required';
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.age.trim()) newErrors.age = 'Required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Required';
    if (!formData.address.trim()) newErrors.address = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const generateCardNumber = () => {
      const year = new Date().getFullYear();
      const random = Math.floor(1000 + Math.random() * 9000);
      return `KBMH-${year}-${random}`;
    };

    Alert.alert('Create Health Card', `Create card for ${formData.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create',
        onPress: async () => {
          try {
            setIsCreating(true);
            // Upload photo to Firebase Storage for permanent URL
            let photoUrl = formData.photo;
            if (formData.photo && !formData.photo.startsWith('http')) {
              const uploadedUrl = await uploadImage(
                formData.photo,
                `health-cards/photos/${Date.now()}.jpg`
              );
              if (uploadedUrl) {
                photoUrl = uploadedUrl;
              }
            }

            const newCard = {
              ...formData,
              photo: photoUrl,
              cardNumber: generateCardNumber(),
              createdAt: new Date().toISOString(),
              validity: 'Lifetime',
            };
            const result = await addHealthCard(newCard);
            const cardId = result?.id || Date.now().toString();
            // Navigate to card preview
            router.replace({ pathname: '/admin/card-preview', params: { cardId } });
          } catch (error) {
            console.error('Error creating card:', error);
            Alert.alert('Error', 'Could not create health card. Please try again.');
          } finally {
            setIsCreating(false);
          }
        },
      },
    ]);
  };

  const updateField = (field: keyof FormData, value: string | null) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handlePickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      updateField('photo', result.assets[0].uri);
    }
  };

  const handlePickAadhar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        updateField('aadharFile', result.assets[0].name);
        Alert.alert('File Selected', result.assets[0].name);
      }
    } catch (err) {
      Alert.alert('Error', 'Could not pick document');
    }
  };

  const pendingRequests = cardRequests.filter((r: any) => r.status === 'pending' || !r.status);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Blue Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/logo.png')} style={styles.logo} />
            </View>
            <Text style={styles.hospitalName}>{hospitalInfo?.name || 'KB MEMORIAL HOSPITAL'}</Text>
            <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
            <Text style={styles.tagline}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>
          </View>

          {/* Main Form Card */}
          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Create Health Card</Text>

            {/* Full Name with Photo */}
            <View style={styles.nameRow}>
              <TouchableOpacity style={[styles.photoUpload, errors.photo && styles.photoError]} onPress={handlePickPhoto}>
                {formData.photo ? (
                  <Image source={{ uri: formData.photo }} style={styles.photoImage} />
                ) : (
                  <>
                    <MaterialCommunityIcons name="account" size={32} color={errors.photo ? COLORS.error : COLORS.primary} />
                    <View style={styles.cameraIcon}>
                      <MaterialCommunityIcons name="camera" size={12} color={COLORS.white} />
                    </View>
                  </>
                )}
              </TouchableOpacity>
              <View style={styles.nameInputContainer}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <View style={[styles.inputContainer, errors.name && styles.inputError]}>
                  <MaterialCommunityIcons name="account-outline" size={18} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter full name"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.name}
                    onChangeText={(text) => updateField('name', text)}
                  />
                </View>
              </View>
            </View>

            {/* Age and Gender Row */}
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.fieldLabel}>Age</Text>
                <View style={[styles.inputContainer, errors.age && styles.inputError]}>
                  <MaterialCommunityIcons name="account-outline" size={18} color={COLORS.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Male"
                    placeholderTextColor={COLORS.textSecondary}
                    value={formData.age}
                    onChangeText={(text) => updateField('age', text.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <MaterialCommunityIcons name="chevron-down" size={18} color={COLORS.textSecondary} />
                </View>
              </View>

              <View style={styles.col}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  <TouchableOpacity
                    style={[styles.genderButton, formData.gender === 'Male' && styles.genderButtonActive]}
                    onPress={() => updateField('gender', 'Male')}
                  >
                    <MaterialCommunityIcons
                      name="human-male"
                      size={16}
                      color={formData.gender === 'Male' ? COLORS.white : COLORS.primary}
                    />
                    <Text style={[styles.genderText, formData.gender === 'Male' && styles.genderTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.genderButton, formData.gender === 'Female' && styles.genderButtonActive]}
                    onPress={() => updateField('gender', 'Female')}
                  >
                    <MaterialCommunityIcons
                      name="human-female"
                      size={16}
                      color={formData.gender === 'Female' ? COLORS.white : COLORS.primary}
                    />
                    <Text style={[styles.genderText, formData.gender === 'Female' && styles.genderTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Address */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Address</Text>
              <View style={[styles.inputContainer, errors.address && styles.inputError]}>
                <MaterialCommunityIcons name="map-marker-outline" size={18} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter address"
                  placeholderTextColor={COLORS.textSecondary}
                  value={formData.address}
                  onChangeText={(text) => updateField('address', text)}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Mobile Number</Text>
              <View style={[styles.inputContainer, errors.mobile && styles.inputError]}>
                <MaterialCommunityIcons name="phone-outline" size={18} color={COLORS.textSecondary} />
                <Text style={styles.countryCode}>+91</Text>
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
            </View>

            {/* Blood Group */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Blood Group</Text>
              <TouchableOpacity
                style={[styles.inputContainer, errors.bloodGroup && styles.inputError]}
                onPress={() => setShowBloodGroupPicker(!showBloodGroupPicker)}
              >
                <MaterialCommunityIcons name="water-outline" size={18} color={COLORS.textSecondary} />
                <Text style={[styles.selectText, !formData.bloodGroup && styles.placeholderText]}>
                  {formData.bloodGroup || 'Select'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={18} color={COLORS.textSecondary} />
              </TouchableOpacity>
              {showBloodGroupPicker && (
                <View style={styles.pickerDropdown}>
                  {bloodGroups.map((group) => (
                    <TouchableOpacity
                      key={group}
                      style={styles.pickerItem}
                      onPress={() => {
                        updateField('bloodGroup', group);
                        setShowBloodGroupPicker(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, formData.bloodGroup === group && styles.pickerItemTextSelected]}>
                        {group}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Aadhar Card Upload */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Aadhar Card (PDF)</Text>
              <TouchableOpacity style={styles.uploadContainer} onPress={handlePickAadhar}>
                <MaterialCommunityIcons name="cloud-upload-outline" size={20} color={COLORS.primary} />
                <Text style={styles.uploadText}>
                  {formData.aadharFile || 'Upload Aadhar Card'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Create Card Button */}
            <TouchableOpacity 
              style={[styles.createButton, isCreating && styles.createButtonDisabled]} 
              onPress={handleSave} 
              activeOpacity={0.85}
              disabled={isCreating}
            >
              {isCreating ? (
                <View style={styles.createButtonLoading}>
                  <ActivityIndicator size="small" color={COLORS.white} />
                  <Text style={styles.createButtonText}>Creating...</Text>
                </View>
              ) : (
                <Text style={styles.createButtonText}>Create Card</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.replace('/home')} activeOpacity={0.7}>
          <MaterialCommunityIcons name="home" size={24} color={COLORS.textSecondary} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/requests')} activeOpacity={0.7}>
          <View style={styles.navIconContainer}>
            <MaterialCommunityIcons name="file-document-multiple" size={24} color={COLORS.textSecondary} />
            {pendingRequests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length > 9 ? '9+' : pendingRequests.length}</Text>
              </View>
            )}
          </View>
          <Text style={styles.navText}>Requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <MaterialCommunityIcons name="card-plus" size={24} color={COLORS.primary} />
          <Text style={[styles.navText, styles.navTextActive]}>Create Card</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 8,
  },
  hospitalAddress: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  hospitalName: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  photoUpload: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  photoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameInputContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: SIZES.small,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 8,
    paddingVertical: 0,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  photoError: {
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  col: {
    flex: 1,
    marginRight: 8,
  },
  genderContainer: {
    flexDirection: 'row',
  },
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: 8,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
  },
  genderText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  genderTextActive: {
    color: COLORS.white,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  countryCode: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  selectText: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  placeholderText: {
    color: COLORS.textSecondary,
  },
  pickerDropdown: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemText: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  pickerItemTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    backgroundColor: COLORS.primaryLight + '10',
  },
  uploadText: {
    fontSize: SIZES.body,
    color: COLORS.primary,
    marginLeft: 8,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  createButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.7,
  },
  createButtonLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    position: 'relative',
  },
  navText: {
    fontSize: SIZES.tiny,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  navTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
