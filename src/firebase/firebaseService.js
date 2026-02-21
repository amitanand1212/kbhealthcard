import { db, storage, auth } from './config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  limit,
  startAfter,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signOut,
} from 'firebase/auth';

// ──────────────────────────────────────────────
// Collection references
// ──────────────────────────────────────────────
const COLLECTIONS = {
  HOSPITAL_INFO: 'hospitalInfo',
  DOCTORS: 'doctors',
  SERVICES: 'services',
  HEALTH_CARD_BENEFITS: 'healthCardBenefits',
  CARD_REQUESTS: 'cardRequests',
  HEALTH_CARDS: 'healthCards',
  ADMIN_USERS: 'adminUsers',
};

// ──────────────────────────────────────────────
// Hospital Info
// ──────────────────────────────────────────────
export const getHospitalInfo = async () => {
  try {
    const docRef = doc(db, COLLECTIONS.HOSPITAL_INFO, 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching hospital info:', error);
    return null;
  }
};

export const setHospitalInfo = async (data) => {
  try {
    await setDoc(doc(db, COLLECTIONS.HOSPITAL_INFO, 'main'), data);
    return true;
  } catch (error) {
    console.error('Error setting hospital info:', error);
    return false;
  }
};

// ──────────────────────────────────────────────
// Doctors
// ──────────────────────────────────────────────
export const getDoctors = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.DOCTORS));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
};

export const addDoctor = async (doctor) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.DOCTORS), doctor);
    return { id: docRef.id, ...doctor };
  } catch (error) {
    console.error('Error adding doctor:', error);
    return null;
  }
};

// ──────────────────────────────────────────────
// Services
// ──────────────────────────────────────────────
export const getServices = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.SERVICES));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

// ──────────────────────────────────────────────
// Health Card Benefits
// ──────────────────────────────────────────────
export const getHealthCardBenefits = async () => {
  try {
    const docRef = doc(db, COLLECTIONS.HEALTH_CARD_BENEFITS, 'main');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching health card benefits:', error);
    return null;
  }
};

// ──────────────────────────────────────────────
// Card Requests
// ──────────────────────────────────────────────
export const getCardRequests = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CARD_REQUESTS),
      orderBy('submittedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching card requests:', error);
    return [];
  }
};

export const addCardRequest = async (request) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CARD_REQUESTS), {
      ...request,
      status: 'pending',
      submittedAt: request.submittedAt || new Date().toISOString(),
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...request, status: 'pending' };
  } catch (error) {
    console.error('Error adding card request:', error);
    return null;
  }
};

export const updateCardRequestStatus = async (id, status) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.CARD_REQUESTS, id), { status });
    return true;
  } catch (error) {
    console.error('Error updating card request status:', error);
    return false;
  }
};

export const updateCardRequest = async (id, updates) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.CARD_REQUESTS, id), updates);
    return true;
  } catch (error) {
    console.error('Error updating card request:', error);
    return false;
  }
};

// Real-time listener for card requests
export const subscribeToCardRequests = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.CARD_REQUESTS),
    orderBy('submittedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(requests);
  }, (error) => {
    console.error('Error listening to card requests:', error);
  });
};

// ──────────────────────────────────────────────
// Health Cards (Created Cards)
// ──────────────────────────────────────────────
export const getHealthCards = async () => {
  try {
    const q = query(
      collection(db, COLLECTIONS.HEALTH_CARDS),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching health cards:', error);
    return [];
  }
};

// Paginated fetch – returns { cards, lastDoc } for infinite scroll
export const getHealthCardsPaginated = async (pageSize = 10, lastDocSnapshot = null) => {
  try {
    let q;
    if (lastDocSnapshot) {
      q = query(
        collection(db, COLLECTIONS.HEALTH_CARDS),
        orderBy('createdAt', 'desc'),
        startAfter(lastDocSnapshot),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.HEALTH_CARDS),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
    }
    const snapshot = await getDocs(q);
    const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const last = snapshot.docs[snapshot.docs.length - 1] || null;
    return { cards, lastDoc: last };
  } catch (error) {
    console.error('Error fetching paginated health cards:', error);
    return { cards: [], lastDoc: null };
  }
};

export const addHealthCard = async (card) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.HEALTH_CARDS), {
      ...card,
      createdAt: card.createdAt || new Date().toISOString(),
    });
    return { id: docRef.id, ...card };
  } catch (error) {
    console.error('Error adding health card:', error);
    return null;
  }
};

export const getHealthCardById = async (cardId) => {
  try {
    const docRef = doc(db, COLLECTIONS.HEALTH_CARDS, cardId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error fetching health card:', error);
    return null;
  }
};

// Real-time listener for health cards
export const subscribeToHealthCards = (callback) => {
  const q = query(
    collection(db, COLLECTIONS.HEALTH_CARDS),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(cards);
  }, (error) => {
    console.error('Error listening to health cards:', error);
  });
};

// ──────────────────────────────────────────────
// Image Upload to Firebase Storage
// ──────────────────────────────────────────────
export const uploadImage = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

// ──────────────────────────────────────────────
// Seed initial data to Firestore (run once)
// ──────────────────────────────────────────────
export const seedInitialData = async (hospitalInfo, doctors, services, healthCardBenefits) => {
  try {
    // Seed hospital info
    await setDoc(doc(db, COLLECTIONS.HOSPITAL_INFO, 'main'), hospitalInfo);

    // Seed doctors
    for (const doctor of doctors) {
      await setDoc(doc(db, COLLECTIONS.DOCTORS, doctor.id), doctor);
    }

    // Seed services
    for (const service of services) {
      await setDoc(doc(db, COLLECTIONS.SERVICES, service.id), service);
    }

    // Seed health card benefits
    await setDoc(doc(db, COLLECTIONS.HEALTH_CARD_BENEFITS, 'main'), healthCardBenefits);

    console.log('✅ Initial data seeded to Firestore successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding initial data:', error);
    return false;
  }
};

// ──────────────────────────────────────────────
// Admin User Management
// ──────────────────────────────────────────────

// Check if a mobile number belongs to an admin
export const checkAdminByMobile = async (mobile) => {
  try {
    // Check by document ID (mobile number)
    const docRef = doc(db, COLLECTIONS.ADMIN_USERS, mobile);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { exists: true, isAdmin: data.isAdmin === true, data };
    }
    
    // Also check by querying mobile field
    const q = query(
      collection(db, COLLECTIONS.ADMIN_USERS),
      where('mobile', '==', mobile)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return { exists: true, isAdmin: data.isAdmin === true, data };
    }
    
    return { exists: false, isAdmin: false, data: null };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { exists: false, isAdmin: false, data: null };
  }
};

// Admin login with email and password (checks Firestore adminUsers collection)
export const adminLoginWithEmail = async (email, password) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.ADMIN_USERS),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: 'No admin account found with this email.' };
    }

    const adminDoc = snapshot.docs[0];
    const data = adminDoc.data();

    if (data.isAdmin !== true) {
      return { success: false, message: 'This account does not have admin access.' };
    }

    if (data.password !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    return { success: true, message: 'Login successful!', data };
  } catch (error) {
    console.error('Error in admin email login:', error);
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

// Generate and store OTP in Firestore
export const generateAndStoreOtp = async (mobile) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

    await setDoc(doc(db, 'otpVerifications', mobile), {
      otp,
      mobile,
      expiresAt,
      verified: false,
      createdAt: serverTimestamp(),
    });

    return otp;
  } catch (error) {
    console.error('Error generating OTP:', error);
    return null;
  }
};

// Verify OTP from Firestore
export const verifyStoredOtp = async (mobile, enteredOtp) => {
  try {
    const docRef = doc(db, 'otpVerifications', mobile);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return { success: false, message: 'OTP not found. Please request a new OTP.' };
    }

    const data = docSnap.data();

    // Check expiry
    if (new Date() > new Date(data.expiresAt)) {
      return { success: false, message: 'OTP has expired. Please request a new OTP.' };
    }

    // Check if already verified
    if (data.verified) {
      return { success: false, message: 'OTP already used. Please request a new OTP.' };
    }

    // Verify OTP
    if (data.otp === enteredOtp) {
      await updateDoc(docRef, { verified: true });
      return { success: true, message: 'OTP verified successfully!' };
    }

    return { success: false, message: 'Invalid OTP. Please try again.' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Verification failed. Please try again.' };
  }
};

// Seed default admin user (call once to set up)
export const seedAdminUser = async (mobile, name = 'Admin') => {
  try {
    await setDoc(doc(db, COLLECTIONS.ADMIN_USERS, mobile), {
      mobile,
      name,
      isAdmin: true,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Admin user seeded: ${mobile}`);
    return true;
  } catch (error) {
    console.error('Error seeding admin user:', error);
    return false;
  }
};

// Seed default admin user with email/password (call once to set up)
export const seedAdminWithEmail = async (email, password, name = 'Admin') => {
  try {
    // Use email as document ID (replace dots for Firestore key safety)
    const docId = email.replace(/[.]/g, '_');
    const docRef = doc(db, COLLECTIONS.ADMIN_USERS, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return true; // Already exists
    }
    await setDoc(docRef, {
      email,
      password,
      name,
      isAdmin: true,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Admin user seeded with email: ${email}`);
    return true;
  } catch (error) {
    console.error('Error seeding admin with email:', error);
    return false;
  }
};

// Firebase Auth logout
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

export { COLLECTIONS };
