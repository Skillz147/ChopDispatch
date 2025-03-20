// src/screens/CheckOutPayment/CheckoutDelivery.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Modal, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/CheckoutDeliveryStyles";
import colors from "../../styles/colors";

const CheckoutDelivery = ({ onNext, formData, setNextEnabled, setNextData }) => {
  const [deliveryOption, setDeliveryOption] = useState("rider");
  const [tempAddress, setTempAddress] = useState("");
  const [showRiderForm, setShowRiderForm] = useState(false);
  const [riderInstructions, setRiderInstructions] = useState("");
  const [proofOfDelivery, setProofOfDelivery] = useState(false);
  const [receiverName, setReceiverName] = useState(formData.name || "");
  const [receiverNumber, setReceiverNumber] = useState(formData.phone || "");
  const [urgent, setUrgent] = useState(false);
  const [pickupTime, setPickupTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Define delivery costs
  const BASE_RIDER_FEE = 2500; // Base rider fee
  const URGENT_FEE = 1000; // Urgent delivery fee
  const riderFee = deliveryOption === "rider" ? BASE_RIDER_FEE : 0;
  const urgentFee = deliveryOption === "rider" && urgent ? URGENT_FEE : 0;
  const formatPrice = (price) => `₦${(price || 0).toLocaleString("en-NG")}`;

  useEffect(() => {
    const isValid =
      (deliveryOption === "rider" && formData.address) ||
      (deliveryOption === "temporary" && tempAddress);
    setNextEnabled(isValid);
    if (isValid) {
      setNextData({
        option: deliveryOption,
        tempAddress: deliveryOption === "temporary" ? tempAddress : "",
        riderInstructions: deliveryOption === "rider" ? riderInstructions : "",
        proofOfDelivery: deliveryOption === "rider" ? proofOfDelivery : false,
        receiverName: deliveryOption === "rider" ? receiverName : "",
        receiverNumber: deliveryOption === "rider" ? receiverNumber : "",
        urgent: deliveryOption === "rider" ? urgent : false,
        pickupTime: deliveryOption === "rider" ? pickupTime : null,
      });
    } else {
      setNextData(null);
    }
  }, [
    deliveryOption,
    tempAddress,
    riderInstructions,
    proofOfDelivery,
    receiverName,
    receiverNumber,
    urgent,
    pickupTime,
    formData.address,
    setNextEnabled,
    setNextData,
  ]);

  const handleRiderDetails = () => {
    setShowRiderForm(true);
  };

  const saveRiderDetails = () => {
    setShowRiderForm(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Option</Text>
      <TouchableOpacity
        style={[
          styles.optionButton,
          deliveryOption === "rider" && styles.optionButtonSelected,
        ]}
        onPress={() => setDeliveryOption("rider")}
      >
        <Icon name="bike" size={20} color={colors.textDark} style={styles.icon} />
        <Text style={styles.optionText}>
          Use Rider to Deliver to {formData.address || "Your Address"}
        </Text>
      </TouchableOpacity>
      {deliveryOption === "rider" && (
        <>
          <TouchableOpacity
            style={styles.riderDetailsButton}
            onPress={handleRiderDetails}
          >
            <Icon name="information-outline" size={20} color={colors.primary} />
            <Text style={styles.riderDetailsText}>Provide Rider Details</Text>
          </TouchableOpacity>
          {/* Delivery Cost Display */}
          <View style={styles.costContainer}>
            <Text style={styles.costText}>
              Delivery Cost: {formatPrice(riderFee)} {urgent && `+ ${formatPrice(urgentFee)} (Urgent Fee)`}
            </Text>
          </View>
        </>
      )}
      <TouchableOpacity
        style={[
          styles.optionButton,
          deliveryOption === "temporary" && styles.optionButtonSelected,
        ]}
        onPress={() => setDeliveryOption("temporary")}
      >
        <Icon name="map-marker-plus" size={20} color={colors.textDark} style={styles.icon} />
        <Text style={styles.optionText}>Provide Temporary Address</Text>
      </TouchableOpacity>
      {deliveryOption === "temporary" && (
        <View style={styles.inputContainer}>
          <Icon name="map" size={20} color={colors.textDark} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Temporary Address"
            placeholderTextColor={colors.darkBane}
            value={tempAddress}
            onChangeText={setTempAddress}
          />
        </View>
      )}

      {/* Rider Details Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showRiderForm}
        onRequestClose={() => setShowRiderForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rider Delivery Details</Text>
            <Text style={styles.modalSubtitle}>
              Delivery Address: {formData.address || "Not provided"}
            </Text>
            <View style={styles.inputContainer}>
              <Icon name="account-outline" size={20} color={colors.textDark} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Receiver Name"
                placeholderTextColor={colors.darkBane}
                value={receiverName}
                onChangeText={setReceiverName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color={colors.textDark} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Receiver Phone"
                placeholderTextColor={colors.darkBane}
                value={receiverNumber}
                onChangeText={setReceiverNumber}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="note-text" size={20} color={colors.textDark} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Additional Instructions (e.g., gate code)"
                placeholderTextColor={colors.darkBane}
                value={riderInstructions}
                onChangeText={setRiderInstructions}
                multiline
              />
            </View>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar-clock" size={20} color={colors.textDark} />
              <Text style={styles.dateText}>{pickupTime.toLocaleString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={pickupTime}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setPickupTime(date);
                }}
              />
            )}
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Request Proof of Delivery</Text>
              <Switch
                value={proofOfDelivery}
                onValueChange={setProofOfDelivery}
                trackColor={{ false: "#C7C7CC", true: colors.primary }}
                thumbColor={proofOfDelivery ? "#FFFFFF" : "#F4F4F4"}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Urgent Pickup</Text>
              <Switch
                value={urgent}
                onValueChange={setUrgent}
                trackColor={{ false: "#C7C7CC", true: colors.primary }}
                thumbColor={urgent ? "#FFFFFF" : "#F4F4F4"}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowRiderForm(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveRiderDetails}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CheckoutDelivery;