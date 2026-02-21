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

// Fallback local data
import hospitalInfoLocal from '../data/hospitalInfo.json';
import doctorsLocal from '../data/doctors.json';
import servicesLocal from '../data/services.json';
import healthCardBenefitsLocal from '../data/healthCardBenefits.json';

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
    await phoneAuthSignOut();
    set({ isAdminLoggedIn: false, adminUser: null });
  },

  // Admin OTP via Firebase Phone Auth (sends real SMS)
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

  // Initialize App Data from Firebase (with local fallback)
  initializeData: async () => {
    set({ isLoading: true });
    try {
      // Fetch all data from Firestore in parallel
      const [fbHospitalInfo, fbDoctors, fbServices, fbBenefits, fbRequests, fbCards] =
        await Promise.all([
          getHospitalInfo(),
          getDoctors(),
          getServices(),
          getHealthCardBenefits(),
          getCardRequests(),
          getHealthCards(),
        ]);

      // Use Firestore data if available, else fallback to local JSON
      const hospitalInfo = fbHospitalInfo || hospitalInfoLocal;
      const doctors = fbDoctors.length > 0 ? fbDoctors : (doctorsLocal.doctors || doctorsLocal);
      const services = fbServices.length > 0 ? fbServices : (servicesLocal.services || servicesLocal);
      const healthCardBenefits = fbBenefits || healthCardBenefitsLocal;

      set({
        hospitalInfo,
        doctors,
        services,
        healthCardBenefits,
        cardRequests: fbRequests,
        healthCards: fbCards,
        isLoading: false,
      });

      // If Firestore was empty, seed the initial data
      if (!fbHospitalInfo && fbDoctors.length === 0) {
        console.log('Seeding initial data to Firestore...');
        await seedInitialData(
          hospitalInfoLocal,
          doctorsLocal.doctors || doctorsLocal,
          servicesLocal.services || servicesLocal,
          healthCardBenefitsLocal
        );
      }

      // Set up real-time listeners for card requests & health cards
      const unsubRequests = subscribeToCardRequests((requests) => {
        set({ cardRequests: requests });
      });
      const unsubCards = subscribeToHealthCards((cards) => {
        set({ healthCards: cards });
      });

      set({ _unsubscribeRequests: unsubRequests, _unsubscribeCards: unsubCards });

      console.log('✅ App data loaded from Firebase');
    } catch (error) {
      console.error('Error loading Firebase data, using local fallback:', error);
      // Fallback to local data
      set({
        hospitalInfo: hospitalInfoLocal,
        doctors: doctorsLocal.doctors || doctorsLocal,
        services: servicesLocal.services || servicesLocal,
        healthCardBenefits: healthCardBenefitsLocal,
        isLoading: false,
      });
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
