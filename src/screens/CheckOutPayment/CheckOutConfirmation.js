// src/screens/CheckOutConfirmation.js
import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Image, Dimensions } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native";
import successAnimation from "../../../assets/lottie/success.json"; // Adjust path
import failureAnimation from "../../../assets/lottie/failure.json"; // Adjust path
import styles from "../../styles/CheckOutConfirmationStyles";
import colors from "../../styles/colors";
import siteDetails from "../../config/siteDetails.json";

const { width } = Dimensions.get("window");

const CheckOutConfirmation = ({ paymentResponse, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const titleScaleAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  useEffect(() => {
    // Log paymentResponse for debugging

    const playSound = async () => {
      try {
        const soundFile =
          paymentResponse?.status === "success"
            ? require("../../../assets/sounds/success.mp3")
            : require("../../../assets/sounds/failure.mp3");
        const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true, volume: 0.5 });
        soundRef.current = sound;
        return () => {
          if (soundRef.current) soundRef.current.unloadAsync();
        };
      } catch (error) {
        console.error("Error playing sound:", error);
      }
    };

    if (paymentResponse) {
      playSound();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(titleScaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(titleScaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((err) => console.error("Unload error:", err));
      }
    };
  }, [paymentResponse, fadeAnim, scaleAnim, titleScaleAnim]);

  if (!paymentResponse) return null;

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}
      accessible={true}
      accessibilityLabel="Checkout Confirmation"
    >
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }}
          style={styles.logo}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="Delivero"
        />
        <Text style={styles.logoTagline}>SPEED, EFFICIENCY & TRUST</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: titleScaleAnim }] }}>
        <Text style={styles.title}>
          {paymentResponse.status === "success" ? "Order Confirmed!" : "Payment Failed"}
        </Text>
      </Animated.View>
      <View style={styles.body} accessible={true}>
        {paymentResponse.status === "success" ? (
          <>
            <LottieView
              source={successAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
              accessible={true}
              accessibilityLabel="Success Animation"
            />
            <View style={styles.confirmRow}>
              <Icon name="receipt" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>Transaction ID: {paymentResponse.transactionId}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Icon name="cash" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>Amount Paid: ₦{paymentResponse.amount.toLocaleString("en-NG")}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Icon name="barcode" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>Order Tracking Code: {paymentResponse.trackingCode}</Text>
            </View>
            {paymentResponse.riderTrackingNumber && (
              <View style={styles.confirmRow}>
                <Icon name="bike" size={20} color={colors.textDark} style={styles.icon} />
                <Text style={styles.text}>Rider Tracking Number: {paymentResponse.riderTrackingNumber}</Text>
              </View>
            )}
            <View style={styles.confirmRow}>
              <Icon name="store" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>Order placed with {siteDetails.siteName}!</Text>
            </View>
          </>
        ) : (
          <>
            <LottieView
              source={failureAnimation}
              autoPlay
              loop={false}
              style={styles.animation}
              accessible={true}
              accessibilityLabel="Failure Animation"
            />
            <View style={styles.confirmRow}>
              <Icon name="receipt" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>Transaction ID: {paymentResponse.transactionId}</Text>
            </View>
            <View style={styles.confirmRow}>
              <Icon name="alert" size={20} color={colors.textDark} style={styles.icon} />
              <Text style={styles.text}>
                Payment failed. Please try again or contact {siteDetails.siteName} support.
              </Text>
            </View>
          </>
        )}
      </View>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close Confirmation"
      >
        <View style={styles.buttonContent}>
          <Icon name="close" size={20} color={colors.surface} style={styles.closeIcon} />
          <Text style={styles.closeButtonText}>Close</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CheckOutConfirmation;