// src/components/LoginSheetWidget.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/LoginSheetWidgetStyles";
import colors from "../styles/colors";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import { showToast } from "./ToastMessage"; // Ensure this import matches your file structure
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { EXPO_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID, ANDROID_GOOGLE_CLIENT_ID } from "@env";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GOOGLE_ICON_URL = "https://ipfs.phonetor.com/ipfs/QmNRWCy5hDoAgai6a3Hi3zah86CJUVv9YgbNi2UvWabnK6";
const APPLE_ICON_URL = "https://ipfs.phonetor.com/ipfs/QmQU9YLf4y6tE42K7nWJQYepMRcSn8tPPhfZDmtK1AEVN5";

const isExpoGo = Constants.appOwnership === "expo";

const LoginSheetWidget = () => {
  const { loading, login } = useContext(AuthContext);
  const [isWidgetVisible, setWidgetVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: EXPO_GOOGLE_CLIENT_ID,
    iosClientId: IOS_GOOGLE_CLIENT_ID,
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      handleSocialLogin("google", id_token);
    }
  }, [response]);

  const handleEmailLogin = () => {
    if (!email || !password) {
      showToast("Email and password are required!", "error");
      return;
    }
    login({ email, password }, navigation, "email");
  };

  const handleGoogleLogin = () => {
    if (isExpoGo) {
      showToast("Google login is not supported in Expo Go.", "error");
      return;
    }
    promptAsync();
  };

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
      if (!appleAuth.identityToken) {
        throw new Error("Apple login failed.");
      }
      handleSocialLogin("apple", appleAuth.identityToken);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleSocialLogin = (type, token) => {
    login({ type, token }, navigation, type);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setWidgetVisible(false);
  };

  return (
    <>
      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setWidgetVisible(true)}
      >
        <View style={styles.floatingButtonContent}>
          <Icon name="login" size={24} color="#FFFFFF" />
          <Text style={styles.floatingButtonText}>Login</Text>
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isWidgetVisible}
        onRequestClose={() => setWidgetVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setWidgetVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingContainer}
          >
            <View style={styles.widgetContainer}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Loader color={colors.flagship} size="large" />
                </View>
              ) : (
                <>
                  <Text style={styles.accountText}>Already Have An Account?</Text>

                  <View style={styles.inputContainer}>
                    <Icon name="email" size={24} color={colors.flagship} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#777"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Icon name="lock" size={24} color={colors.flagship} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#777"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Icon
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color={colors.flagship}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.loginButton} onPress={handleEmailLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>

                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>Or</Text>
                    <View style={styles.divider} />
                  </View>

                  <View style={styles.socialContainer}>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={handleGoogleLogin}
                    >
                      <Image source={{ uri: GOOGLE_ICON_URL }} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iconButton}
                      onPress={handleAppleLogin}
                    >
                      <Image source={{ uri: APPLE_ICON_URL }} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default LoginSheetWidget;