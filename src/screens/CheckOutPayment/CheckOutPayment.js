// src/screens/CheckoutPayment/CheckOutPayment.js
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Linking } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/CheckOutPaymentStyles";
import colors from "../../styles/colors";

const CheckOutPayment = ({
  formData,
  paymentMethod,
  deliveryOption,
  tempAddress,
  totalAmount,
  cartItems,
  triggerPayment, // New prop to trigger modal
}) => {
  const [agreed, setAgreed] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePayNow = () => {
    if (!agreed) {
      alert("Please agree to the Terms and Conditions to proceed.");
      return;
    }
    triggerPayment(); // Open the payment modal
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.title}>Confirm Payment</Text>
      <View style={styles.summaryRow}>
        <Icon name="cash" size={20} color={colors.textDark} style={styles.icon} />
        <Text style={styles.summaryText}>Total: ₦{totalAmount.toLocaleString("en-NG")}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Icon name="credit-card-outline" size={20} color={colors.textDark} style={styles.icon} />
        <Text style={styles.summaryText}>Payment Method: {paymentMethod}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Icon name="truck-delivery" size={20} color={colors.textDark} style={styles.icon} />
        <Text style={styles.summaryText}>
          Delivery: {deliveryOption === "rider" ? `Rider to ${formData.address}` : `Temporary: ${tempAddress}`}
        </Text>
      </View>
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAgreed(!agreed)}>
          <Icon
            name={agreed ? "checkbox-marked" : "checkbox-blank-outline"}
            size={20}
            color={colors.textDark}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.agreeText}>I agree to the </Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://delivero-orpin.vercel.app/terms")}>
          <Text style={styles.linkText}>Terms and Conditions</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.payButton, !agreed && styles.payButtonDisabled]}
        onPress={handlePayNow}
        disabled={!agreed}
      >
        <Icon name="credit-card-outline" size={22} color={colors.surface} style={{ marginRight: 5 }} />
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CheckOutPayment;