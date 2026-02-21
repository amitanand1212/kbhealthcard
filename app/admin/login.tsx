import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SIZES } from '../../src/constants';
import { useAppStore } from '../../src/store';
import { Alert } from '../../src/utils/alert';

export default function AdminLoginScreen() {
  const { setAdminLogin, sendAdminOtp, verifyAdminOtp, checkIsAdmin, seedDefaultAdmin } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!mobile.trim() || mobile.length !== 10) {
      Alert.alert('Error', 'Please enter valid 10-digit mobile number');
      return;
    }

    setLoading(true);

    try {
      // First seed default admin if not exists (only first time)
      await seedDefaultAdmin('9262706867');

      // Send OTP via Firebase Phone Auth (real SMS)
      const success = await sendAdminOtp(mobile);
      
      if (success) {
        setStep('otp');
        Alert.alert('OTP Sent', `OTP has been sent via SMS to +91 ${mobile}`);
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please check the phone number and try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert('Error', 'Please enter valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Verify OTP via Firebase Phone Auth
      const verifyResult = await verifyAdminOtp(mobile, otp);

      if (!verifyResult.success) {
        Alert.alert('Error', verifyResult.message);
        setLoading(false);
        return;
      }

      // OTP verified! Now check if user is admin in Firestore
      const adminResult = await checkIsAdmin(mobile);

      if (adminResult.isAdmin) {
        // User is an admin - grant access
        setAdminLogin({ 
          mobile, 
          name: adminResult.data?.name || 'Admin',
          isAdmin: true 
        });
        Alert.alert('Success', `Welcome, ${adminResult.data?.name || 'Admin'}!`);
        router.replace('/(tabs)');
      } else {
        // User is NOT an admin
        Alert.alert(
          'Access Denied', 
          'You are not an admin. Only authorized administrators can access this panel.',
          [{ text: 'OK', onPress: () => {
            setStep('mobile');
            setOtp('');
            setMobile('');
          }}]
        );
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const success = await sendAdminOtp(mobile);
      if (success) {
        Alert.alert('OTP Resent', `New OTP has been sent via SMS to +91 ${mobile}`);
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('mobile');
    setOtp('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Blue Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Text style={styles.hospitalName}>{hospitalInfo?.name || 'KB MEMORIAL HOSPITAL'}</Text>
          <Text style={styles.hospitalAddress}>Baheri, Darbhanga, Bihar</Text>
          <Text style={styles.tagline}>{hospitalInfo?.tagline || 'Care With Compassion'}</Text>

          {/* Admin Login Badge */}
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin Login</Text>
          </View>
        </View>

        {/* White Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Admin Login</Text>

          {step === 'mobile' ? (
            <>
              {/* Mobile Number Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="phone" size={20} color={COLORS.textSecondary} />
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor={COLORS.textSecondary}
                  value={mobile}
                  onChangeText={(text) => setMobile(text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              {/* Info Text */}
              <Text style={styles.infoText}>OTP will be sent to this number for verification</Text>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleSendOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Send OTP</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* OTP Input */}
              <View style={styles.otpHeader}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                  <MaterialCommunityIcons name="arrow-left" size={20} color={COLORS.primary} />
                </TouchableOpacity>
                <Text style={styles.otpSubtitle}>Enter OTP sent to +91 {mobile}</Text>
              </View>

              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="lock" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.textSecondary}
                  value={otp}
                  onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>

              {/* Resend OTP */}
              <TouchableOpacity style={styles.forgotContainer} onPress={handleResendOtp}>
                <Text style={styles.forgotText}>Resend OTP</Text>
              </TouchableOpacity>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleVerifyOtp}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Verify OTP</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Secure Access Notice */}
          <View style={styles.secureNotice}>
            <MaterialCommunityIcons name="lock" size={14} color={COLORS.textSecondary} />
            <Text style={styles.secureNoticeText}>Secure Admin Access Only</Text>
          </View>
        </View>

        {/* Info Notice */}
        <View style={styles.demoContainer}>
          <MaterialCommunityIcons name="information" size={18} color={COLORS.white} />
          <Text style={styles.demoTitle}>  Admin Access Info</Text>
          <Text style={styles.demoText}>Only registered admin mobile numbers can access the admin panel. Contact super admin to get access.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 30,
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
    marginBottom: 16,
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
  tagline: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 4,
  },
  hospitalAddress: {
    fontSize: SIZES.body,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 2,
  },
  adminBadge: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  adminBadgeText: {
    color: COLORS.white,
    fontSize: SIZES.body,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCode: {
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    marginLeft: 8,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
    paddingVertical: 16,
    marginLeft: 10,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: '500',
  },
  infoText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  otpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 10,
  },
  otpSubtitle: {
    flex: 1,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  secureNoticeText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  demoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: SIZES.radius,
  },
  demoTitle: {
    fontSize: SIZES.body,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  demoText: {
    fontSize: SIZES.small,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 4,
  },
});
