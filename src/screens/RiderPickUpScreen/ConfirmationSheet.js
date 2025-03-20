import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native"; // Import Lottie
import successAnimation from "../../../assets/lottie/success.json"; // Adjust path
import failureAnimation from "../../../assets/lottie/failure.json"; // Adjust path
import styles from "../../styles/ConfirmationSheetStyles";
import colors from "../../styles/colors";
import siteDetails from "../../config/siteDetails.json";

const ConfirmationSheet = ({ visible, onClose, paymentStatus, trackingNumber }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoScaleAnim = useRef(new Animated.Value(1)).current; // Logo bounce
  const soundRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      try {
        const soundFile = paymentStatus === "success"
          ? require("../../../assets/sounds/success.mp3")
          : require("../../../assets/sounds/failure.mp3");
        const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true, volume: 0.5 });
        soundRef.current = sound;


        return () => {
          if (soundRef.current) {
            soundRef.current.unloadAsync();
          }
        };
      } catch (error) {
        console.error("Error playing sound:", error.message);
      }
    };

    if (visible) {
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
          Animated.timing(logoScaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(logoScaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((err) => console.error("Unload error:", err));
      }
    };
  }, [visible, paymentStatus, fadeAnim, scaleAnim, logoScaleAnim]);

  const handleClose = () => {
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay} accessible={true} accessibilityLabel="Confirmation Sheet">
      <TouchableOpacity
        style={styles.overlayTouchable}
        activeOpacity={1}
        onPress={() => ("")}
        accessible={true}
        accessibilityRole="button"
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
          accessible={true}
        >
          <View style={styles.handle} />
          <Animated.View style={{ transform: [{ scale: logoScaleAnim }] }}>
            <Image
              source={{ uri: "https://ipfs.phonetor.com/ipfs/QmajGVR3amqnNyxWRnJys1v1oJNYU1gTxcA9umADTVFD4r" }} // Replace with correct URL
              style={styles.logo}
              resizeMode="contain"
              accessible={true}
              accessibilityLabel="Mowiz Logo"
            />
          </Animated.View>
          <Text style={styles.title}>
            {paymentStatus === "success" ? "Payment Successful" : "Payment Failed"}
          </Text>
          <View style={styles.body} accessible={true}>
            {paymentStatus === "success" ? (
              <>
                <LottieView
                  source={successAnimation}
                  autoPlay
                  loop={false}
                  style={styles.animation}
                  accessible={true}
                  accessibilityLabel="Success Animation"
                />
                <Text style={styles.text}>Tracking Number: {trackingNumber}</Text>
                <Text style={styles.text}>{siteDetails.siteName} Rider Assigned!</Text>
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
                <Text style={styles.text}>
                  Please try again or contact {siteDetails.siteName} support.
                </Text>
              </>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleClose}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close Button"
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationSheet;