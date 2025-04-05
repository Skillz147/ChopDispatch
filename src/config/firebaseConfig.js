// config/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  signInWithPhoneNumber,
} from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics"; // Add Analytics imports
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import phoneDemo from "./phoneDemo.json";

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
} from "@env";

// Firebase Configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  databaseURL: FIREBASE_DATABASE_URL,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Auth with persistence (unchanged)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore, Storage, and Realtime Database (unchanged)
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDB = getDatabase(app);

// Add Analytics (safely, only if supported)
let analytics = null;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized.");
    } else {
      console.warn("Firebase Analytics is not supported in this environment (e.g., Expo Go).");
    }
  })
  .catch((error) => {
    console.error("Error initializing Firebase Analytics:", error);
  });

/**
 * 🔹 Function to Sign in with Phone Number (unchanged)
 */
const signInWithPhone = async (phoneNumber) => {
  try {
    if (!phoneNumber.startsWith("+")) {
      throw new Error("Enter a valid phone number with country code.");
    }

    const isExpoGo = Platform.OS === "ios" || Platform.OS === "android";

    if (isExpoGo && phoneDemo[phoneNumber]) {
      return {
        verificationId: "EXPO_GO_FAKE_VERIFICATION",
        demoCode: phoneDemo[phoneNumber],
      };
    } else {
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
      return confirmation;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * 🔹 Function to Fetch Stores from Firestore (unchanged)
 */
const fetchStoresFromFirestore = async () => {
  try {
    const storesCollection = collection(db, "stores");
    const snapshot = await getDocs(storesCollection);
    const stores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // Cache the stores in AsyncStorage
    await AsyncStorage.setItem("cachedStores", JSON.stringify(stores));
    return stores;
  } catch (error) {
    console.error("Error fetching stores from Firestore:", error);
    throw error;
  }
};

/**
 * 🔹 Function to Get Cached Stores from AsyncStorage (unchanged)
 */
const getCachedStores = async () => {
  try {
    const cachedStores = await AsyncStorage.getItem("cachedStores");
    return cachedStores ? JSON.parse(cachedStores) : null;
  } catch (error) {
    console.error("Error retrieving cached stores:", error);
    return null;
  }
};

export {auth,  db,  storage,  realtimeDB,  analytics,   logEvent,   signInWithPhone,  fetchStoresFromFirestore,  getCachedStores};