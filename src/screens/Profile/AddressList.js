import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Added for icons
import { db } from "../../config/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import styles from "../../styles/AddressListStyles"; // Your exact import
import colors from "styles/colors";

const AddressList = ({ addresses, setAddresses, setShowAddressForm }) => {
  const handleDeleteAddress = async (addressId) => {
    await deleteDoc(doc(db, "addresses", addressId));
    setAddresses(addresses.filter((addr) => addr.id !== addressId));
  };

  return (
    <View style={styles.addressSection}>
      <Text style={styles.sectionTitle}>Addresses</Text>
      {addresses.map((addr) => (
        <View key={addr.id} style={styles.addressCard}>
          <View style={styles.addressContainer}>
            <Ionicons name="location-outline" size={20} color={colors.textDark} style={styles.addressIcon} />
            <Text style={styles.addressText}>{addr.address} ({addr.customName})</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteAddress(addr.id)}
            accessibilityLabel={`Delete Address ${addr.customName}`}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddressForm(true)}
        accessibilityLabel="Add New Address"
      >
        <Ionicons name="add-outline" size={20} color={colors.surface} style={styles.addIcon} />
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddressList;