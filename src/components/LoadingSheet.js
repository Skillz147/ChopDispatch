// src/components/LoadingSheet.js
import React, { useEffect, useContext } from "react";
import { View, Modal, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SignupContext } from "../context/SignupProvider";
import LottieView from "lottie-react-native";

const LoadingSheet = ({ visible, signupData, onComplete, onSuccess, onError }) => {
  const { signup } = useContext(SignupContext);
  const navigation = useNavigation();
  const hasRunRef = React.useRef(false);

  const handleSignup = async () => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    try {
      // Start signup process
      await signup(signupData, navigation);
      // Ensure at least 5 seconds of visibility
      await new Promise((resolve) => setTimeout(resolve, 5000));
      navigation.replace("Onboarding");
      onSuccess();
      onComplete(); // Hide after navigation
    } catch (error) {
      // Even on error, show for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      onError(error);
      onComplete();
    }
    hasRunRef.current = false;
  };

  useEffect(() => {
    if (visible && signupData) {
      handleSignup();
    }
  }, [visible, signupData]);

  if (!visible) return null;

  return (
    <Modal animationType="fade" transparent={false} visible={visible} statusBarTranslucent={true}>
      <View style={styles.container}>
        <LottieView
          source={require("../../assets/lottie/loading.json")} // Adjust path
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333", // Full-screen white background
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: "100%",
    height: "100%", // Takes up entire screen
  },
});

export default LoadingSheet;