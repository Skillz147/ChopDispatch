// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeDoc = null;

    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            unsubscribeDoc = onSnapshot(
              userDocRef,
              async (docSnapshot) => {
                if (docSnapshot.exists()) {
                  const firestoreData = docSnapshot.data();
                  const hasSeenOnboarding = firestoreData.hasSeenOnboarding || false;

                  const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firestoreData.displayName || firebaseUser.displayName || "",
                    phone: firestoreData.phone || "",
                    role: firestoreData.role || "customer",
                    createdAt: firestoreData.createdAt || new Date().toISOString(),
                    hasAppliedForVendor: firestoreData.hasAppliedForVendor || false,
                    vendorApplicationId: firestoreData.vendorApplicationId || null,
                  };

                  setUser(userData);
                  await AsyncStorage.setItem("user", JSON.stringify(userData));
                  await AsyncStorage.setItem("hasSeenOnboarding", hasSeenOnboarding.toString());
                } else {
                  const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || "",
                    phone: "",
                    role: "customer",
                    createdAt: new Date().toISOString(),
                    hasAppliedForVendor: false,
                    vendorApplicationId: null,
                  };
                  setUser(userData);
                  await AsyncStorage.setItem("user", JSON.stringify(userData));
                  await AsyncStorage.setItem("hasSeenOnboarding", "false");
                }
                if (initializing) setInitializing(false);
                setLoading(false);
              },
              (error) => {
                console.error("AuthProvider: onSnapshot error:", error.message);
                if (initializing) setInitializing(false);
                setLoading(false);
              }
            );
          } else {
            if (unsubscribeDoc) unsubscribeDoc();
            setUser(null);
            await AsyncStorage.removeItem("user");
            if (initializing) setInitializing(false);
            setLoading(false);
          }
        }, (error) => {
          console.error("AuthProvider: onAuthStateChanged error:", error.message);
          if (initializing) setInitializing(false);
          setLoading(false);
        });
      } catch (error) {
        console.error("AuthProvider: Error in loadUser:", error.message);
        if (initializing) setInitializing(false);
        setLoading(false);
      }
    };

    loadUser();

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const setAuthLoading = (value) => {
    setLoading(value);
  };

  const login = async (data, navigation, type) => {
    setLoading(true);
    try {
      let userCredential;
      if (type === "email") {
        const { email, password } = data;
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else if (type === "google") {
        const { token } = data;
        const credential = GoogleAuthProvider.credential(token);
        userCredential = await signInWithCredential(auth, credential);
      } else if (type === "apple") {
        const { token } = data;
        const credential = OAuthProvider.credentialFromJSON({ idToken: token });
        userCredential = await signInWithCredential(auth, credential);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
      const userChoice = await AsyncStorage.getItem("userChoice");
      navigation.replace(hasSeenOnboarding === "true" && userChoice ? "Home" : "Onboarding");
    } catch (error) {
      console.error("AuthProvider: Login error:", error.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      if (user) {
        await AsyncStorage.removeItem(`cartItems_${user.uid}`);
        await AsyncStorage.removeItem(`favorites_${user.uid}`);
      }
      // Clear all user-related AsyncStorage keys
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("hasSeenOnboarding");
      await AsyncStorage.removeItem("userChoice");
      await AsyncStorage.removeItem("pendingUser");
      await AsyncStorage.removeItem("lastActivity"); // From OptionScreen.js
      setUser(null);
    } catch (error) {
      console.error("AuthProvider: Logout error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, setAuthLoading }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;