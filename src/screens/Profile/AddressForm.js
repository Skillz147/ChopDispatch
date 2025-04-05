import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Your exact import
import { db } from "../../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import styles from "../../styles/AddressFormStyles"; // Your exact import
import colors from "styles/colors"; // Your exact import

const AddressForm = ({ user, addresses, setAddresses, showAddressForm, setShowAddressForm, newAddress, setNewAddress }) => {
  const [formData, setFormData] = useState({
    address: "",
    customName: "",
    landmark: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(""); // Clear error on input change
  };

  const handleAddAddress = async () => {
    const { address, customName, landmark } = formData;
    if (!address.trim() || !customName.trim()) {
      setError("Please fill in address and custom name.");
      return;
    }

    try {
      const addressData = {
        userId: user.uid,
        address,
        createdAt: new Date().toISOString(),
        customName,
        landmark: landmark.trim() || "",
        email: user.email || "", // From user object
        phone: user.phone || "", // From user object
        name: user.displayName || "", // From user object
      };
      const docRef = await addDoc(collection(db, "addresses"), addressData);
      setAddresses([...addresses, { id: docRef.id, ...addressData }]);
      setFormData({
        address: "",
        customName: "",
        landmark: "",
      });
      setShowAddressForm(false);
      setNewAddress("");
    } catch (error) {
      console.error("Error adding address:", error);
      setError("Failed to add address. Please try again.");
    }
  };

  return (
    showAddressForm && (
      <View style={styles.addAddressContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.inputContainer}>
          <Ionicons name="pricetag-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            value={formData.customName}
            onChangeText={(text) => handleInputChange("customName", text)}
            placeholder="Custom Name E.G: My House"
            placeholderTextColor={colors.textLight}
            style={styles.addressInput}
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={false}
            accessibilityLabel="Custom Name Input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            placeholder="Enter Your Address E.G 123 new address, city, state"
            placeholderTextColor={colors.textLight}
            style={styles.addressInput}
            keyboardType="default"
            multiline={true}
            returnKeyType={Platform.OS === "ios" ? "done" : "next"}
            blurOnSubmit={false}
            accessibilityLabel="Address Input"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="flag-outline" size={20} color={colors.textLight} style={styles.inputIcon} />
          <TextInput
            value={formData.landmark}
            onChangeText={(text) => handleInputChange("landmark", text)}
            placeholder="Popular Landmark E.G Beside Chop Dispatch Office"
            placeholderTextColor={colors.textLight}
            style={styles.addressInput}
            returnKeyType={Platform.OS === "ios" ? "done" : "done"}
            blurOnSubmit={true}
            accessibilityLabel="Landmark Input"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleAddAddress}
            accessibilityLabel="Save New Address"
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowAddressForm(false)}
            accessibilityLabel="Cancel Address Form"
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  );
};

export default AddressForm;