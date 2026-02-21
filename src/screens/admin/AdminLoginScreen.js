import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAppStore } from '../../store';

const AdminLoginScreen = ({ navigation }) => {
  const setAdminLogin = useAppStore((state) => state.setAdminLogin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // For now, using static credentials (will be replaced with Firebase Auth later)
  const ADMIN_EMAIL = 'admin@kbmemorial.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    // Simulate login (replace with Firebase Auth)
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        setAdminLogin({ email });
        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.iconContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Admin Login</Text>
        <Text style={styles.subtitle}>Access restricted to hospital staff only</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={20} color={COLORS.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={20} color={COLORS.textSecondary} />
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

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loginButtonText}>Logging in...</Text>
            ) : (
              <>
                <MaterialCommunityIcons name="login" size={20} color={COLORS.white} />
                <Text style={styles.loginButtonText}>Login</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo credentials hint */}
        <View style={styles.demoHint}>
          <Text style={styles.demoText}>Demo Credentials:</Text>
          <Text style={styles.demoCredentials}>admin@kbmemorial.com / admin123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logo: {
    width: SIZES.logo,
    height: SIZES.logo,
    borderRadius: SIZES.logo / 2,
  },
  title: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: SIZES.radius,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    fontSize: SIZES.body,
    color: COLORS.textPrimary,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    padding: 16,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: SIZES.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 8,
  },
  demoHint: {
    marginTop: 30,
    padding: 16,
    backgroundColor: COLORS.warning + '20',
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  demoText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  demoCredentials: {
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
});

export default AdminLoginScreen;
