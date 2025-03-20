// src/components/AuthSheet.js
import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { showToast } from "./ToastMessage";
import PhoneAuthSheet from "./PhoneAuthSheet";
import SignupSheet from "./SignupSheet";
import LoginSheetWidget from "./LoginSheetWidget";
import { SignupContext } from "../context/SignupProvider";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/AuthSheetStyles";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { EXPO_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID, ANDROID_GOOGLE_CLIENT_ID } from "@env";
import Constants from "expo-constants";

const GOOGLE_ICON_URL = "https://ipfs.phonetor.com/ipfs/QmNRWCy5hDoAgai6a3Hi3zah86CJUVv9YgbNi2UvWabnK6";
const APPLE_ICON_URL = "https://ipfs.phonetor.com/ipfs/QmQU9YLf4y6tE42K7nWJQYepMRcSn8tPPhfZDmtK1AEVN5";
const isExpoGo = Constants.appOwnership === "expo";

const AuthSheet = ({ visible, onClose, onSignupStart }) => {
  const [isPhoneSheetVisible, setPhoneSheetVisible] = useState(false);
  const [isSignupSheetVisible, setSignupSheetVisible] = useState(false);
  const [googleIcon, setGoogleIcon] = useState(GOOGLE_ICON_URL);
  const [appleIcon, setAppleIcon] = useState(APPLE_ICON_URL);

  const { signup } = useContext(SignupContext);
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_GOOGLE_CLIENT_ID,
    iosClientId: IOS_GOOGLE_CLIENT_ID,
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          showToast("Google login successful!", "success");
          onClose();
        })
        .catch((error) => showToast(error.message, "error"));
    }
  }, [response]);

  const handleAppleLogin = async () => {
    if (isExpoGo) {
      showToast("Apple login is not supported in Expo Go.", "error");
      return;
    }
    try {
      const appleAuth = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!appleAuth.identityToken) throw new Error("Apple login failed.");
      const credential = OAuthProvider.credentialFromJSON({ idToken: appleAuth.identityToken });
      await signInWithCredential(auth, credential);
      showToast("Apple login successful!", "success");
      onClose();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleGoogleLogin = async () => {
    if (isExpoGo) {
      showToast("Google login is not supported in Expo Go.", "error");
      return;
    }
    promptAsync();
  };

  const handleSignupStart = async (data) => {
    setSignupSheetVisible(false);
    try {
      await signup(data, navigation); // Handles navigation to Onboarding
      showToast("Signup successful!", "success");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s delay
      onClose();
      if (onSignupStart) onSignupStart(data);
    } catch (error) {
      showToast(`Signup failed: ${error.message}`, "error");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Sign up to continue</Text>
          <Text style={styles.subtitle}>In order to continue you need to create an account</Text>

          <TouchableOpacity onPress={() => setPhoneSheetVisible(true)} style={styles.phoneButton}>
            <Text style={styles.phoneButtonText}>Continue with phone number</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleAppleLogin} style={styles.socialButton}>
            <Image source={{ uri: appleIcon }} style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialButton}>
            <Image source={{ uri: googleIcon }} style={styles.icon} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity onPress={() => setSignupSheetVisible(true)} style={styles.emailButton}>
            <Text style={styles.emailButtonText}>Sign up with Email</Text>
          </TouchableOpacity>

          <PhoneAuthSheet visible={isPhoneSheetVisible} onClose={() => setPhoneSheetVisible(false)} />
          <SignupSheet
            visible={isSignupSheetVisible}
            onClose={() => setSignupSheetVisible(false)}
            onSignupStart={handleSignupStart}
          />
          <LoginSheetWidget />
        </View>
      </View>
    </Modal>
  );
};

export default AuthSheet;