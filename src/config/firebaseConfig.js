import { initializeApp, getApps } from "firebase/app";
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
    signInWithPhoneNumber
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import phoneDemo from "./phoneDemo.json"; // ✅ Import demo numbers

import {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID
} from "@env"; 

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
};

// ✅ Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// ✅ Persistent Authentication
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// ✅ Initialize Firestore, Storage, and Realtime Database
const db = getFirestore(app);
const storage = getStorage(app);
const realtimeDB = getDatabase(app);

/**
 * 🔹 Function to Sign in with Phone Number
 */
const signInWithPhone = async (phoneNumber) => {
    try {
        if (!phoneNumber.startsWith("+")) {
            throw new Error("Enter a valid phone number with country code.");
        }

        // ✅ Detect if running in Expo Go
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

export { auth, db, storage, realtimeDB, signInWithPhone };
