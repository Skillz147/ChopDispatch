// src/screens/CheckOutPaymentMethod.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/CheckOutPaymentMethodStyles";
import colors from "../../styles/colors";

const CheckOutPaymentMethod = ({ onNext, totalAmount, setNextEnabled, setNextData }) => {
  // Default selectedMethod to "bank_transfer"
  const [selectedMethod, setSelectedMethod] = useState("bank_transfer");

  const paymentMethods = [
    { id: "bank_transfer", label: "Bank Transfer", icon: "bank" },
    { id: "card", label: "Card", icon: "credit-card" },
  ];

  useEffect(() => {
    // Enable the "Next" button since selectedMethod always has a value
    setNextEnabled(true);
    // Pass the selected payment method to the parent
    setNextData(selectedMethod);
  }, [selectedMethod, setNextEnabled, setNextData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>
      <Text style={styles.totalText}>Total: ₦{totalAmount.toLocaleString("en-NG")}</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.optionButton,
            selectedMethod === method.id && styles.optionButtonSelected,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <Icon name={method.icon} size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.optionText}>{method.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default CheckOutPaymentMethod;