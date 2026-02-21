import { create } from 'zustand';
import {
  getHospitalInfo,
  getDoctors,
  getServices,
  getHealthCardBenefits,
  getCardRequests,
  getHealthCards,
  addCardRequest as fbAddCardRequest,
  updateCardRequestStatus as fbUpdateCardRequestStatus,
  updateCardRequest as fbUpdateCardRequest,
  addHealthCard as fbAddHealthCard,
  subscribeToCardRequests,
  subscribeToHealthCards,
  seedInitialData,
  checkAdminByMobile,
  seedAdminUser,
} from '../firebase/firebaseService';
import { sendPhoneOtp, verifyPhoneOtp, phoneAuthSignOut } from '../firebase/phoneAuth';
import { adminLoginWithEmail, seedAdminWithEmail } from '../firebase/firebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback local data
import hospitalInfoLocal from '../data/hospitalInfo.json';
import doctorsLocal from '../data/doctors.json';
import servicesLocal from '../data/services.json';
import healthCardBenefitsLocal from '../data/healthCardBenefits.json';

// ── Cache helpers ──
const CACHE_KEY = 'fb_cache';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours — static data rarely changes

const loadCache = async () => {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw);
    if (Date.now() - cache.timestamp > CACHE_TTL) return null; // expired
    return cache.data;
  } catch { return null; }
};

const saveCache = async (data) => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* non-critical */ }
};

// Main App Store
const useAppStore = create((set, get) => ({
  // Hospital Info
  hospitalInfo: null,
  setHospitalInfo: (info) => set({ hospitalInfo: info }),

  // Doctors
  doctors: [],
  setDoctors: (doctors) => set({ doctors }),

  // Services
  services: [],
  setServices: (services) => set({ services }),

  // Health Card Benefits
  healthCardBenefits: null,
  setHealthCardBenefits: (benefits) => set({ healthCardBenefits: benefits }),

  // Health Card Requests (for admin)
  cardRequests: [],
  setCardRequests: (requests) => set({ cardRequests: requests }),

  addCardRequest: async (request) => {
    const result = await fbAddCardRequest(request);
    if (result) {
      // Real-time listener (subscribeToCardRequests) will update state automatically
      return result;
    }
    // Fallback: local-only add (no Firestore listener will fire)
    const localRequest = { ...request, id: Date.now().toString(), status: 'pending' };
    set((state) => ({
      cardRequests: [localRequest, ...state.cardRequests],
    }));
    return localRequest;
  },

  updateRequestStatus: async (id, status) => {
    await fbUpdateCardRequestStatus(id, status);
    set((state) => ({
      cardRequests: state.cardRequests.map((req) =>
        req.id === id ? { ...req, status } : req
      ),
    }));
  },

  updateCardRequest: async (id, updates) => {
    await fbUpdateCardRequest(id, updates);
    set((state) => ({
      cardRequests: state.cardRequests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    }));
  },

  // Created Health Cards
  healthCards: [],
  setHealthCards: (cards) => set({ healthCards: cards }),

  addHealthCard: async (card) => {
    const result = await fbAddHealthCard(card);
    if (result) {
      // Real-time listener (subscribeToHealthCards) will update state automatically
      return result;
    }
    // Fallback: local-only add (no Firestore listener will fire)
    set((state) => ({
      healthCards: [card, ...state.healthCards],
    }));
    return card;
  },

  // Admin Auth State
  isAdminLoggedIn: false,
  adminUser: null,
  setAdminLogin: (user) => set({ isAdminLoggedIn: true, adminUser: user }),
  adminLogout: async () => {
    set({ isAdminLoggedIn: false, adminUser: null });
  },

  // Admin login with email & password
  loginAdmin: async (email, password) => {
    const result = await adminLoginWithEmail(email, password);
    if (result.success) {
      // Only start real-time listeners when admin logs in (saves reads for normal users)
      const { _unsubscribeRequests, _unsubscribeCards } = get();
      if (!_unsubscribeRequests) {
        const unsubRequests = subscribeToCardRequests((requests) => {
          set({ cardRequests: requests });
        });
        const unsubCards = subscribeToHealthCards((cards) => {
          set({ healthCards: cards });
        });
        set({ _unsubscribeRequests: unsubRequests, _unsubscribeCards: unsubCards });
      }
    }
    return result;
  },

  // Seed admin (only runs once, cached via AsyncStorage flag)
  seedDefaultAdminEmail: async () => {
    try {
      const seeded = await AsyncStorage.getItem('admin_seeded');
      if (seeded) return true;
      const result = await seedAdminWithEmail('admin@kbmemorial.com', 'admin123', 'Super Admin');
      if (result) await AsyncStorage.setItem('admin_seeded', '1');
      return result;
    } catch { return false; }
  },

  // Legacy OTP methods (kept for compatibility)
  sendAdminOtp: async (mobile) => {
    const success = await sendPhoneOtp(mobile);
    return success;
  },

  verifyAdminOtp: async (mobile, otp) => {
    const result = await verifyPhoneOtp(otp);
    return result;
  },

  checkIsAdmin: async (mobile) => {
    const result = await checkAdminByMobile(mobile);
    return result;
  },

  seedDefaultAdmin: async (mobile) => {
    return await seedAdminUser(mobile);
  },

  // Loading State
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // Firebase real-time unsubscribe functions
  _unsubscribeRequests: null,
  _unsubscribeCards: null,

  // Initialize App Data — LOCAL-FIRST to minimize Firebase reads
  initializeData: async () => {
    set({ isLoading: true });

    // 1. Immediately load local JSON (zero cost, instant)
    const localHospitalInfo = hospitalInfoLocal;
    const localDoctors = doctorsLocal.doctors || doctorsLocal;
    const localServices = servicesLocal.services || servicesLocal;
    const localBenefits = healthCardBenefitsLocal;

    set({
      hospitalInfo: localHospitalInfo,
      doctors: localDoctors,
      services: localServices,
      healthCardBenefits: localBenefits,
    });

    // 2. Try loading from cache (zero Firebase cost)
    const cached = await loadCache();
    if (cached) {
      set({
        hospitalInfo: cached.hospitalInfo || localHospitalInfo,
        doctors: cached.doctors?.length > 0 ? cached.doctors : localDoctors,
        services: cached.services?.length > 0 ? cached.services : localServices,
        healthCardBenefits: cached.healthCardBenefits || localBenefits,
        isLoading: false,
      });
      console.log('✅ App data loaded from cache (0 Firebase reads)');
      return;
    }

    // 3. Cache miss → fetch static data from Firestore (only happens once per 24h)
    try {
      const [fbHospitalInfo, fbDoctors, fbServices, fbBenefits] =
        await Promise.all([
          getHospitalInfo(),
          getDoctors(),
          getServices(),
          getHealthCardBenefits(),
        ]);

      const hospitalInfo = fbHospitalInfo || localHospitalInfo;
      const doctors = fbDoctors.length > 0 ? fbDoctors : localDoctors;
      const services = fbServices.length > 0 ? fbServices : localServices;
      const healthCardBenefits = fbBenefits || localBenefits;

      set({ hospitalInfo, doctors, services, healthCardBenefits, isLoading: false });

      // Save to cache so next launch is free
      await saveCache({ hospitalInfo, doctors, services, healthCardBenefits });

      // Seed only if Firestore is completely empty (first install)
      if (!fbHospitalInfo && fbDoctors.length === 0) {
        console.log('Seeding initial data to Firestore...');
        await seedInitialData(localHospitalInfo, localDoctors, localServices, localBenefits);
      }

      console.log('✅ App data loaded from Firebase & cached');
    } catch (error) {
      console.error('Error loading Firebase data, using local fallback:', error);
      set({ isLoading: false });
    }
  },

  // Start admin real-time listeners (call only when admin logs in)
  startAdminListeners: () => {
    const { _unsubscribeRequests, _unsubscribeCards } = get();
    if (_unsubscribeRequests) return; // already active

    const unsubRequests = subscribeToCardRequests((requests) => {
      set({ cardRequests: requests });
    });
    const unsubCards = subscribeToHealthCards((cards) => {
      set({ healthCards: cards });
    });
    set({ _unsubscribeRequests: unsubRequests, _unsubscribeCards: unsubCards });
  },

  // Load admin data on-demand (not on every app launch)
  loadAdminData: async () => {
    try {
      const [fbRequests, fbCards] = await Promise.all([
        getCardRequests(),
        getHealthCards(),
      ]);
      set({ cardRequests: fbRequests, healthCards: fbCards });
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  },

  // Cleanup listeners
  cleanup: () => {
    const { _unsubscribeRequests, _unsubscribeCards } = get();
    if (_unsubscribeRequests) _unsubscribeRequests();
    if (_unsubscribeCards) _unsubscribeCards();
  },
}));

export default useAppStore;
