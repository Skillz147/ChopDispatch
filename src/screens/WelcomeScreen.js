// src/screens/WelcomeScreen.js
import React, { useContext, useState, useEffect } from "react";
import { View, Text, Modal, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AuthSheet from "../components/AuthSheet";
import LoadingSheet from "../components/LoadingSheet"; // Add this import
import LottieView from "lottie-react-native";
import styles from "../styles/WelcomeScreenStyles";
import colors from "../styles/colors";
import Loader from "../components/Loader";

const animationItems = [
  { title: "Fast & Reliable Rider", source: require("../../assets/lottie/ride.json") },
  { title: "Quick Package Delivery", source: require("../../assets/lottie/food.json") },
  { title: "Active Customer Service", source: require("../../assets/lottie/package.json") },
  { title: "Secure Package Delivery", source: require("../../assets/lottie/dunno.json") },
];

const WelcomeScreen = () => {
  const { user, loading } = useContext(AuthContext);
  const [authVisible, setAuthVisible] = useState(!user && !loading);
  const [currentAnimationIndex, setCurrentAnimationIndex] = useState(0);
  const [signupData, setSignupData] = useState(null); // Store signup data
  const [showLoadingSheet, setShowLoadingSheet] = useState(false); // Control LoadingSheet

  useEffect(() => {
    setAuthVisible(!user && !loading);
  }, [user, loading]);

  useEffect(() => {
    if (!user) {
      const animationInterval = setInterval(() => {
        setCurrentAnimationIndex((prev) => (prev + 1) % animationItems.length);
      }, 5000);
      return () => clearInterval(animationInterval);
    }
  }, [user]);

  const handleSignupRequest = (data) => {
    setSignupData(data);
    setShowLoadingSheet(true); // Trigger LoadingSheet
  };

  const onSignupSuccess = () => {
    setShowLoadingSheet(false);
    setSignupData(null);
  };

  const onSignupError = (error) => {
    setShowLoadingSheet(false);
    setSignupData(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loader color={colors.flagship} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!user && (
        <View style={styles.siteHeader}>
          <Image
            source={require("../../assets/chopdispatch-large2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerGradientOverlay} />
        </View>
      )}

      {!user && (
        <View style={styles.unauthContainer}>
          <LottieView
            source={animationItems[currentAnimationIndex].source}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.lottieText}>{animationItems[currentAnimationIndex].title}</Text>
        </View>
      )}

      <Modal animationType="slide" transparent={true} visible={authVisible}>
        <AuthSheet
          visible={authVisible}
          onClose={() => setAuthVisible(false)}
          onSignupRequest={handleSignupRequest} // Pass callback to AuthSheet
        />
      </Modal>

      <LoadingSheet
        visible={showLoadingSheet}
        signupData={signupData}
        onComplete={() => setShowLoadingSheet(false)}
        onSuccess={onSignupSuccess}
        onError={onSignupError}
      />
    </View>
  );
};

export default WelcomeScreen;