import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { PayWithFlutterwave } from "flutterwave-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../../assets/lottie/loading.json"; // Adjust path
import styles from "../../styles/PaymentSheetStyles";
import { FLUTTERWAVE_PUBLIC_KEY } from "@env";
import siteDetails from "../../config/siteDetails.json";
import colors from "../../styles/colors";

const PaymentSheet = ({
  visible,
  onClose,
  totalCost,
  userEmail,
  receiverNumber,
  receiverName,
  onRedirect,
  formatCurrency,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const generateTransactionRef = () => {
    return `FLW-${Math.random().toString(36).substr(2, 10)}`;
  };

  const paymentOptions = {
    tx_ref: generateTransactionRef(),
    authorization: FLUTTERWAVE_PUBLIC_KEY,
    customer: {
      email: userEmail,
      phonenumber: receiverNumber,
      name: receiverName,
    },
    amount: totalCost,
    currency: "NGN",
    payment_options: "card, ussd, banktransfer",
    customizations: {
      title: `${siteDetails.siteName} Payment`,
      description: "Secure payment for your pickup request",
      logo: "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ",
    },
  };

  const handleRedirect = (data) => {
    if (data.status === "successful" || data.status === "completed") {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onRedirect(data);
      }, 1500);
    } else {
      onRedirect(data);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={onClose}>
        <Animated.View
          style={[
            styles.paymentSheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.sheetHandle} />
          <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: "https://ipfs.phonetor.com/ipfs/QmajGVR3amqnNyxWRnJys1v1oJNYU1gTxcA9umADTVFD4r" }}
                style={styles.sheetLogo}
                resizeMode="contain"
              />
              <Text style={styles.logoTagline}>SPEED, EFFICIENCY & TRUST</Text>
            </View>

            {isProcessing ? (
              <View style={styles.processingContainer}>
                <Text style={styles.sheetTitle}>Confirming your payment...</Text>
                <LottieView
                  source={loadingAnimation}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text style={styles.paymentInfo}>Please wait a moment</Text>
              </View>
            ) : (
              <View style={styles.contentContainer}>
                <Text style={styles.sheetTitle}>Complete Payment for {siteDetails.siteName}</Text>
                <View style={styles.amountContainer}>
                  <Icon name="cash-multiple" size={24} color={colors.flagship} />
                  <Text style={styles.sheetAmount}>{formatCurrency(totalCost)}</Text>
                </View>
                <Text style={styles.paymentInfo}>Pay securely via card, USSD, or bank transfer.</Text>
                <PayWithFlutterwave
                  onRedirect={handleRedirect}
                  options={paymentOptions}
                  customButton={(props) => (
                    <TouchableOpacity
                      style={[
                        styles.sheetPayButton,
                        props.isInitializing && styles.buttonDisabled,
                      ]}
                      onPress={props.onPress}
                      disabled={props.disabled}
                    >
                      <View style={styles.buttonContent}>
                        <Icon name="credit-card-outline" size={22} color="#fff" />
                        <Text style={styles.sheetButtonText}>Pay Now</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.sheetCancelButton} onPress={onClose}>
                  <View style={styles.buttonContent}>
                    <Icon name="close-circle-outline" size={20} color={colors.flagship} />
                    <Text style={styles.sheetCancelText}>Cancel Payment</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default PaymentSheet;