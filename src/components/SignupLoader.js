// src/components/SignupLoader.js
import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const SignupLoader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/lottie/loading.json")} // Adjust path
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Matches AuthSheet background
  },
  animation: {
    width: 120,
    height: 120,
  },
});

export default SignupLoader;