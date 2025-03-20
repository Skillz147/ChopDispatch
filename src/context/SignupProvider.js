import React, { createContext, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import SignupLoader from "../components/SignupLoader";

export const SignupContext = createContext();

const SignupProvider = ({ children }) => {
  const [userChoice, setUserChoice] = useState(null);
  const [signupData, setSignupData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserChoice = async () => {
      try {
        const storedChoice = await AsyncStorage.getItem("userChoice");
        if (storedChoice) {
          setUserChoice(storedChoice);
        }
      } catch (error) {
        console.error("SignupProvider: Error loading user choice:", error);
      }
    };
    loadUserChoice();
  }, []);

  const signup = async (data, navigation) => {
    const { displayName, email, phone, password } = data;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      const userData = {
        uid: user.uid,
        displayName,
        email,
        phone,
        role: "customer",
        createdAt: new Date().toISOString(),
        hasAppliedForVendor: false,
        hasSeenOnboarding: false,
      };

      await setDoc(doc(db, "users", user.uid), userData);
      await AsyncStorage.setItem("pendingUser", JSON.stringify(userData));
      await AsyncStorage.setItem("hasSeenOnboarding", "false");

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }
      await Location.getCurrentPositionAsync();
      navigation.replace("Onboarding");
    } catch (error) {
      console.error("SignupProvider: Signup error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (uid, navigation) => {
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, { hasSeenOnboarding: true });
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      const pendingUser = await AsyncStorage.getItem("pendingUser");
      if (pendingUser) {
        const userData = JSON.parse(pendingUser);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.removeItem("pendingUser");
      }
      navigation.replace("Option");
    } catch (error) {
      console.error("SignupProvider: Error in completeOnboarding:", error.message);
      navigation.replace("Welcome");
    } finally {
      setLoading(false);
    }
  };

  const confirmSignup = async (navigation) => {
    setLoading(true);
    try {
      const pendingUser = await AsyncStorage.getItem("pendingUser");
      if (pendingUser) {
        const userData = JSON.parse(pendingUser);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.removeItem("pendingUser");
        const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        navigation.replace(hasSeenOnboarding === "true" ? "Option" : "Onboarding");
      } else {
        console.warn("SignupProvider: No pendingUser found in confirmSignup");
        navigation.replace("Welcome");
      }
    } catch (error) {
      console.error("SignupProvider: Error confirming signup:", error.message);
      navigation.replace("Welcome");
    } finally {
      setLoading(false);
    }
  };

  const updateUserChoice = async (choice, navigation) => {
    try {
      setUserChoice(choice);
      await AsyncStorage.setItem("userChoice", choice);
      if (navigation) {
        navigation.replace("Home"); // Use replace to avoid stack buildup
      }
    } catch (error) {
      console.error("SignupProvider: Error updating user choice:", error);
    }
  };

  const clearUserChoice = async () => {
    try {
      setUserChoice(null);
      await AsyncStorage.removeItem("userChoice");
    } catch (error) {
      console.error("SignupProvider: Error clearing user choice:", error);
    }
  };

  return (
    <SignupContext.Provider
      value={{
        userChoice,
        setUserChoice: updateUserChoice,
        clearUserChoice,
        signup,
        confirmSignup,
        completeOnboarding,
        signupData,
        loading,
        setLoading,
      }}
    >
      {loading ? <SignupLoader /> : children}
    </SignupContext.Provider>
  );
};

export default SignupProvider;