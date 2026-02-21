import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  browserLocalPersistence,
} from 'firebase/auth';

// Firebase configuration derived from google-services.json
const firebaseConfig = {
  apiKey: 'AIzaSyDgbdh-d-F2jQg3r9gjl_zxM8KU0u47Isk',
  authDomain: 'kbhealthcard.firebaseapp.com',
  projectId: 'kbhealthcard',
  storageBucket: 'kbhealthcard.firebasestorage.app',
  messagingSenderId: '800864125473',
  appId: '1:800864125473:android:f69bf9fbdccd949d1f5960',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Auth with platform-appropriate persistence
let auth;
try {
  if (Platform.OS === 'web') {
    // Web: use browser localStorage persistence
    auth = initializeAuth(app, {
      persistence: browserLocalPersistence,
    });
  } else {
    // Native: use AsyncStorage persistence
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
} catch (e) {
  // Auth already initialized (hot reload)
  auth = getAuth(app);
}

export { app, db, storage, auth };
