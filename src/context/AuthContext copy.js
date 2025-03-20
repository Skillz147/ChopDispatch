// src/context/AuthProvider.js
import React, { createContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore"; // Add onSnapshot
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loader from "../components/Loader";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userChoice, setUserChoice] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedChoice = await AsyncStorage.getItem("userChoice");
        if (storedChoice) setUserChoice(storedChoice);

        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            
            // Listen for real-time updates to the user document
            const unsubscribeDoc = onSnapshot(userDocRef, async (docSnapshot) => {
              if (docSnapshot.exists()) {
                const firestoreData = docSnapshot.data();
                const fullUserData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firestoreData.displayName,
                  phone: firestoreData.phone,
                  role: firestoreData.role,
                  createdAt: firestoreData.createdAt,
                  hasAppliedForVendor: firestoreData.hasAppliedForVendor || false,
                  vendorApplicationId: firestoreData.vendorApplicationId || null,
                };
                setUser(fullUserData);
                await AsyncStorage.setItem("user", JSON.stringify(fullUserData));
              } else {
                const fullUserData = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName || "",
                  phone: "",
                  role: "customer",
                  createdAt: new Date().toISOString(),
                  hasAppliedForVendor: false,
                  vendorApplicationId: null,
                };
                await setDoc(doc(db, "users", firebaseUser.uid), fullUserData);
                setUser(fullUserData);
                await AsyncStorage.setItem("user", JSON.stringify(fullUserData));
              }
              setLoading(false);
            }, (error) => {
              console.error("Error listening to user document:", error);
              setLoading(false);
            });

            // Cleanup the document listener when auth state changes
            return () => unsubscribeDoc();
          } else {
            setUser(null);
            await AsyncStorage.removeItem("user");
            await AsyncStorage.removeItem("userChoice");
            setLoading(false);
          }
        });

        return () => unsubscribeAuth();
      } catch (error) {
        console.error("Error loading auth state:", error);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const setAuthLoading = (value) => setLoading(value);

  const updateUserChoice = async (choice) => {
    setLoading(true);
    setTimeout(async () => {
      setUserChoice(choice);
      await AsyncStorage.setItem("userChoice", choice);
      setLoading(false);
    }, 2000);
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    if (user) {
      await AsyncStorage.removeItem(`cartItems_${user.uid}`);
      await AsyncStorage.removeItem(`favorites_${user.uid}`);
    }
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userChoice");
    setUser(null);
    setUserChoice(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, userChoice, setUserChoice: updateUserChoice, logout, setAuthLoading }}
    >
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;