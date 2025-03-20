import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated } from "react-native";
import { PayWithFlutterwave } from "flutterwave-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/CheckOutPaymentStyles";
import { FLUTTERWAVE_PUBLIC_KEY } from "@env";
import siteDetails from "../../config/siteDetails.json";
import colors from "../../styles/colors";

const TriggerPaymentModal = ({
  visible,
  onClose,
  onPaymentComplete,
  totalAmount,
  formData,
  paymentMethod,
  cartItems,
  deliveryOption,
  tempAddress,
  formatPrice,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }).start();
    }
  }, [visible]);

  const generateTransactionRef = () => `FLW-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;

  const paymentOptions = {
    tx_ref: generateTransactionRef(),
    authorization: FLUTTERWAVE_PUBLIC_KEY,
    customer: {
      email: formData.email || "default@example.com",
      phonenumber: formData.phone || "N/A",
      name: formData.name || "Anonymous",
    },
    amount: totalAmount || 0,
    currency: "NGN",
    payment_options: paymentMethod === "card" ? "card" : "ussd,banktransfer",
    customizations: {
      title: `${siteDetails.siteName} Checkout`,
      description: "Secure payment for your order",
      logo: siteDetails.logoUrl || "https://your-logo-url.com/logo.png",
    },
    meta: {
      cartItems: JSON.stringify(cartItems || []),
      deliveryOption: deliveryOption || "N/A",
      deliveryAddress: deliveryOption === "rider" ? formData.address || "N/A" : tempAddress || "N/A",
    },
  };


  const handleRedirect = (data) => {
    setIsProcessing(false);
    if (data && (data.status === "successful" || data.status === "completed")) {
      const successData = {
        status: "success",
        transactionId: data.transaction_id || "N/A",
        amount: data.amount || totalAmount,
        trackingCode: generateTransactionRef().replace("FLW", "TRK"),
      };
      onPaymentComplete(successData);
    } else {
      const failureData = {
        status: "failed",
        transactionId: data?.transaction_id || "N/A",
        amount: data?.amount || totalAmount,
      };
      onPaymentComplete(failureData);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible}>
      <TouchableOpacity style={styles.sheetOverlay} activeOpacity={1} onPress={() => ("Overlay tapped, not closing")}>
        <Animated.View style={[styles.paymentModal, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sheetHandle} />
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <Icon name="clock-outline" size={60} color={colors.primary} />
              <Text style={styles.processingText}>Processing payment...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.modalTitle}>
                Complete Payment for <Text style={styles.highlight}>{siteDetails.siteName}</Text>
              </Text>
              <View style={styles.amountContainer}>
                <Icon name="cash-multiple" size={24} color={colors.primary} />
                <Text style={styles.sheetAmount}>{formatPrice(totalAmount)}</Text>
              </View>
              <Text style={styles.paymentInfo}>
                Pay securely via {paymentMethod === "card" ? "card" : "USSD or bank transfer"}.
              </Text>
              <PayWithFlutterwave
                onRedirect={handleRedirect}
                options={paymentOptions}
                customButton={(props) => {
                  return (
                    <TouchableOpacity
                      style={[styles.payButton, props.isInitializing && styles.payButtonDisabled]}
                      onPress={() => {
                        setIsProcessing(true);
                        try {
                          props.onPress();
                          // Timeout to reset if no response
                          setTimeout(() => {
                            if (isProcessing) {
                              setIsProcessing(false);
                              alert("Payment initiation failed. Please try again.");
                            }
                          }, 10000);
                        } catch (error) {
                          console.error("Flutterwave onPress error:", error);
                          setIsProcessing(false);
                          alert("Payment error: " + error.message);
                        }
                      }}
                      disabled={props.isInitializing}
                    >
                      <Icon name="credit-card-outline" size={22} color={colors.surface} style={{ marginRight: 5 }} />
                      <Text style={styles.payButtonText}>Pay Now</Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Icon name="close-circle-outline" size={20} color={colors.primary} />
                <Text style={styles.cancelText}>Cancel Payment</Text>
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TriggerPaymentModal;