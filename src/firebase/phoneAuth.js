import { Platform } from 'react-native';
import { auth } from './config';
import {
  signInWithPhoneNumber as jsSignInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as jsSignOut,
} from 'firebase/auth';

// ──────────────────────────────────────────────
// Firebase Phone Authentication
// Works on Web (JS SDK + reCAPTCHA) and Native (React Native Firebase)
// Gracefully falls back if native module is unavailable (Expo Go)
// ──────────────────────────────────────────────

let _confirmation = null;
let _recaptchaVerifier = null;

// Lazy-load native auth – returns null in Expo Go / web
let _nativeAuthResolved = false;
let _nativeAuth = null;

const getNativeAuth = () => {
  if (_nativeAuthResolved) return _nativeAuth;
  _nativeAuthResolved = true;
  try {
    _nativeAuth = require('@react-native-firebase/auth').default;
  } catch {
    _nativeAuth = null;
  }
  return _nativeAuth;
};

// Setup invisible reCAPTCHA for web
const getRecaptchaVerifier = () => {
  if (_recaptchaVerifier) return _recaptchaVerifier;

  // Ensure DOM container exists
  let container = document.getElementById('recaptcha-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'recaptcha-container';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  _recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
    size: 'invisible',
    callback: () => console.log('reCAPTCHA solved'),
    'expired-callback': () => {
      console.log('reCAPTCHA expired, will re-create on next send');
      _recaptchaVerifier = null;
    },
  });

  return _recaptchaVerifier;
};

/**
 * Send OTP to the given phone number.
 * - Web: Firebase JS SDK + invisible reCAPTCHA
 * - Native dev build: React Native Firebase (real SMS)
 * - Expo Go: not supported (returns false)
 */
export const sendPhoneOtp = async (phoneNumber) => {
  try {
    const formattedNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+91${phoneNumber}`;

    if (Platform.OS === 'web') {
      // ── Web path ──
      const verifier = getRecaptchaVerifier();
      const result = await jsSignInWithPhoneNumber(auth, formattedNumber, verifier);
      _confirmation = { type: 'web', result };
      console.log('✅ OTP sent to', formattedNumber, '(web)');
      return true;
    }

    // ── Native path ──
    const nativeAuth = getNativeAuth();
    if (nativeAuth) {
      const result = await nativeAuth().signInWithPhoneNumber(formattedNumber);
      _confirmation = { type: 'native', result };
      console.log('✅ OTP sent to', formattedNumber, '(native)');
      return true;
    }

    // Native module not available (Expo Go)
    console.warn(
      'Phone auth requires a development build. @react-native-firebase/auth is not available in Expo Go.'
    );
    return false;
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    _confirmation = null;
    // Reset reCAPTCHA so it can be re-created on retry
    if (Platform.OS === 'web') _recaptchaVerifier = null;
    return false;
  }
};

/**
 * Verify the OTP entered by the user.
 */
export const verifyPhoneOtp = async (otp) => {
  try {
    if (!_confirmation) {
      return { success: false, message: 'No OTP request found. Please request a new OTP.' };
    }

    const userCredential = await _confirmation.result.confirm(otp);
    _confirmation = null;

    const user = userCredential.user;
    console.log('✅ Phone number verified:', user.phoneNumber);
    return {
      success: true,
      message: 'Phone number verified successfully!',
      user: {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
      },
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);

    const code = error.code || '';
    if (code === 'auth/invalid-verification-code') {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
    if (code === 'auth/session-expired' || code === 'auth/code-expired') {
      _confirmation = null;
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }
    return { success: false, message: 'Verification failed. Please try again.' };
  }
};

/**
 * Sign out the Firebase Auth user.
 */
export const phoneAuthSignOut = async () => {
  try {
    if (Platform.OS === 'web') {
      await jsSignOut(auth);
    } else {
      const nativeAuth = getNativeAuth();
      if (nativeAuth) {
        await nativeAuth().signOut();
      } else {
        // Fallback to JS SDK sign out
        await jsSignOut(auth);
      }
    }
    _confirmation = null;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};
