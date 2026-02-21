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
  const { setAdminLogin, loginAdmin, loadAdminData } = useAppStore();
  const hospitalInfo = useAppStore((state) => state.hospitalInfo);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await loginAdmin(email.trim(), password);

      if (result.success) {
        setAdminLogin({
          email: email.trim(),
          name: result.data?.name || 'Admin',
          isAdmin: true,
        });
        // Load admin-only data (card requests, health cards) on successful login
        await loadAdminData();
        Alert.alert('Success', `Welcome, ${result.data?.name || 'Admin'}!`);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Access Denied', result.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

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
          <Text style={styles.demoText}>Only authorized administrators can access this panel. Contact super admin to get access.</Text>
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
