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
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../../constants';
import { useAppStore } from '../../store';
import { registerAdminWithEmail } from '../../firebase/firebaseService';

const AdminLoginScreen = ({ navigation }) => {
  const setAdminLogin = useAppStore((state) => state.setAdminLogin);
  const loginAdmin = useAppStore((state) => state.loginAdmin);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const result = await loginAdmin(email.trim(), password);
      if (result.success) {
        setAdminLogin({ email: email.trim(), ...result.data });
        navigation.replace('AdminDashboard');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await registerAdminWithEmail(email.trim(), password, name.trim());
      if (result.success) {
        Alert.alert(
          'Registration Successful',
          'Your account has been created. Please wait for admin approval before you can login.',
          [{ text: 'OK', onPress: () => setIsRegisterMode(false) }]
        );
        setEmail('');
        setPassword('');
        setName('');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
    setLoading(false);
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

        <Text style={styles.title}>{isRegisterMode ? 'Admin Register' : 'Admin Login'}</Text>
        <Text style={styles.subtitle}>
          {isRegisterMode
            ? 'Create your admin account (requires approval)'
            : 'Access restricted to hospital staff only'}
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {isRegisterMode && (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={20} color={COLORS.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={COLORS.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

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
            onPress={isRegisterMode ? handleRegister : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.loginButtonText}>
                {isRegisterMode ? 'Registering...' : 'Logging in...'}
              </Text>
            ) : (
              <>
                <MaterialCommunityIcons
                  name={isRegisterMode ? 'account-plus' : 'login'}
                  size={20}
                  color={COLORS.white}
                />
                <Text style={styles.loginButtonText}>
                  {isRegisterMode ? 'Register' : 'Login'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Toggle Login/Register */}
        <TouchableOpacity
          style={styles.toggleContainer}
          onPress={() => {
            setIsRegisterMode(!isRegisterMode);
            setEmail('');
            setPassword('');
            setName('');
          }}
        >
          <Text style={styles.toggleText}>
            {isRegisterMode
              ? 'Already have an account? '
              : "Don't have an account? "}
            <Text style={styles.toggleLink}>
              {isRegisterMode ? 'Login' : 'Register'}
            </Text>
          </Text>
        </TouchableOpacity>

        {isRegisterMode && (
          <View style={styles.demoHint}>
            <MaterialCommunityIcons name="information" size={18} color={COLORS.warning} />
            <Text style={[styles.demoText, { marginLeft: 8, flex: 1 }]}>
              After registration, your account needs to be approved by an existing admin before you can login.
            </Text>
          </View>
        )}
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
    marginTop: 16,
    padding: 16,
    backgroundColor: COLORS.warning + '20',
    borderRadius: SIZES.radius,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  demoText: {
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  demoCredentials: {
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 4,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: SIZES.body,
    color: COLORS.textSecondary,
  },
  toggleLink: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});

export default AdminLoginScreen;
