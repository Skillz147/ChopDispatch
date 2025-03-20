// src/screens/SignupSheet.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Linking, // Import Linking for opening URLs
} from "react-native";
import { showToast } from "./ToastMessage";
import styles from "../styles/SignupSheetStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import colors from "../styles/colors";

const SignupSheet = ({ visible, onClose, onSignupStart }) => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSignup = () => {
    if (!displayName || !email || !phone || !password || !confirmPassword) {
      showToast("All fields are required!", "error");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    setShowConfirmation(true); // Show confirmation step
  };

  const handleConfirmSignup = () => {
    setShowConfirmation(false);
    const signupData = { displayName, email, phone, password };
    if (onSignupStart) {
      onSignupStart(signupData); // Pass signup data to AuthSheet/WelcomeScreen
    }
    resetForm(); // Reset form immediately, LoadingSheet will handle the rest
  };

  const handleDeclineSignup = () => {
    setShowConfirmation(false);
    showToast("Signup cancelled", "info");
  };

  const resetForm = () => {
    setDisplayName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setShowConfirmation(false);
  };

  // Function to open Terms & Conditions URL
  const handleTermsPress = async () => {
    const termsUrl = "https://delivero-orpin.vercel.app/terms"; // Replace with your actual domain
    try {
      const supported = await Linking.canOpenURL(termsUrl);
      if (supported) {
        await Linking.openURL(termsUrl);
      } else {
        showToast("Unable to open Terms & Conditions", "error");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      showToast("Error opening Terms & Conditions", "error");
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalBackground}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.authContainer}>
                <Text style={styles.title}>Create an Account</Text>

                <View style={styles.inputContainer}>
                  <Icon name="account" size={24} color="#333" style={styles.icon} />
                  <TextInput
                    placeholder="Display Name"
                    placeholderTextColor="#333"
                    value={displayName}
                    onChangeText={setDisplayName}
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="email" size={24} color="#333" style={styles.icon} />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#333"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="phone" size={24} color="#333" style={styles.icon} />
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor="#333"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={styles.input}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock" size={24} color="#333" style={styles.icon} />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#333"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!passwordVisible}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <Icon name="lock-check" size={24} color="#333" style={styles.icon} />
                  <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#333"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!confirmPasswordVisible}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    <Icon name={confirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#333" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, showConfirmation && styles.buttonDisabled]}
                  onPress={handleSignup}
                  disabled={showConfirmation}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleTermsPress} style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By signing up, you agree to our <Text style={styles.termsLink}>Terms & Conditions</Text>.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>

                {/* Confirmation Overlay */}
                {showConfirmation && (
                  <View style={styles.confirmationOverlay}>
                    <View style={styles.confirmationBox}>
                      <Text style={styles.confirmationTitle}>Confirm Your Details</Text>
                      <View style={styles.detailsContainer}>
                        <View style={styles.detailItem}>
                          <Icon name="account" size={24} color={colors.primary} style={styles.detailIcon} />
                          <Text style={styles.detailText}>Name: {displayName}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Icon name="email" size={24} color={colors.primary} style={styles.detailIcon} />
                          <Text style={styles.detailText}>Email: {email}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Icon name="phone" size={24} color={colors.primary} style={styles.detailIcon} />
                          <Text style={styles.detailText}>Phone: {phone}</Text>
                        </View>
                      </View>
                      <View style={styles.confirmationButtons}>
                        <TouchableOpacity
                          style={styles.confirmButton}
                          onPress={handleConfirmSignup}
                        >
                          <Text style={styles.confirmButtonText}>Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.declineButton}
                          onPress={handleDeclineSignup}
                        >
                          <Text style={styles.declineButtonText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignupSheet;