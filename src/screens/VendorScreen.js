// src/screens/VendorScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import VendorConfirmationSheet from "../components/VendorConfirmationSheet";
import colors from "../styles/colors";
import styles from "../styles/VendorScreenStyles";
import { useNavigation } from "@react-navigation/native"; // Add this import

const VendorScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation(); // Access navigation

  // State for "About You" section
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredContact, setPreferredContact] = useState("Email");

  // State for "About Business" section
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [hasPhysicalLocation, setHasPhysicalLocation] = useState("No");
  const [businessAddress, setBusinessAddress] = useState("");
  const [hasWebsite, setHasWebsite] = useState("No");
  const [businessWebsite, setBusinessWebsite] = useState("");
  const [hasInstagram, setHasInstagram] = useState("No");
  const [businessInstagram, setBusinessInstagram] = useState("");

  // State for Terms and Conditions
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const [isConfirmationSheetVisible, setIsConfirmationSheetVisible] = useState(false);

  const handleSubmit = () => {
    if (!acceptedTerms) {
      Alert.alert("Error", "You must accept the Terms and Conditions to submit the application.");
      return;
    }

    if (!fullName || !email || !businessName || !businessCategory) {
      Alert.alert("Error", "Please fill in all required fields (marked with *).");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    const formData = {
      fullName,
      address,
      city,
      state,
      phone,
      email,
      preferredContact,
      businessName,
      businessCategory,
      hasPhysicalLocation,
      ...(hasPhysicalLocation === "Yes" && { businessAddress }),
      hasWebsite,
      ...(hasWebsite === "Yes" && { businessWebsite }),
      hasInstagram,
      ...(hasInstagram === "Yes" && { businessInstagram }),
    };

    setIsConfirmationSheetVisible(true);
  };

  const resetForm = () => {
    setFullName("");
    setAddress("");
    setCity("");
    setState("");
    setPhone("");
    setEmail("");
    setPreferredContact("Email");
    setBusinessName("");
    setBusinessCategory("");
    setHasPhysicalLocation("No");
    setBusinessAddress("");
    setHasWebsite("No");
    setBusinessWebsite("");
    setHasInstagram("No");
    setBusinessInstagram("");
    setAcceptedTerms(false);
  };

  const toggleTermsModal = () => {
    setTermsModalVisible(!termsModalVisible);
  };

  const openTermsLink = () => {
    // Replace with your actual Terms and Conditions URL
    const termsUrl = "https://delivero-orpin.vercel.app/terms";
    Linking.openURL(termsUrl).catch(() => {
      Alert.alert("Error", "Unable to open Terms and Conditions link.");
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="storefront" size={30} color={colors.primary} />
        <Text style={styles.headerTitle}>Vendor Application</Text>
      </View>

      {/* About You Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About You</Text>

        <View style={styles.fieldContainer}>
          <Icon name="account" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Full Name"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="map-marker" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Address"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="city" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="City"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="map" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="Enter your state"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="State"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="phone" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Phone"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="email" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Email"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="message" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Preferred Contact</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                preferredContact === "Email" && styles.optionButtonSelected,
              ]}
              onPress={() => setPreferredContact("Email")}
              accessibilityLabel="Preferred Contact: Email"
            >
              <Text style={styles.optionText}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                preferredContact === "Phone" && styles.optionButtonSelected,
              ]}
              onPress={() => setPreferredContact("Phone")}
              accessibilityLabel="Preferred Contact: Phone"
            >
              <Text style={styles.optionText}>Phone</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* About Your Business Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About Your Business</Text>

        <View style={styles.fieldContainer}>
          <Icon name="store" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Business Name *</Text>
          <TextInput
            style={styles.input}
            value={businessName}
            onChangeText={setBusinessName}
            placeholder="Enter your business name"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Business Name"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="tag" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Business Category *</Text>
          <TextInput
            style={styles.input}
            value={businessCategory}
            onChangeText={setBusinessCategory}
            placeholder="e.g., Food, Retail, Services"
            placeholderTextColor={colors.textLight}
            accessibilityLabel="Business Category"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Icon name="map-marker-check" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Has Physical Location?</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasPhysicalLocation === "No" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasPhysicalLocation("No")}
              accessibilityLabel="Physical Location: No"
            >
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasPhysicalLocation === "Yes" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasPhysicalLocation("Yes")}
              accessibilityLabel="Physical Location: Yes"
            >
              <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {hasPhysicalLocation === "Yes" && (
          <View style={styles.fieldContainer}>
            <Icon name="map-marker" size={20} color={colors.textDark} style={styles.icon} />
            <Text style={styles.label}>Business Address</Text>
            <TextInput
              style={styles.input}
              value={businessAddress}
              onChangeText={setBusinessAddress}
              placeholder="Enter your business address"
              placeholderTextColor={colors.textLight}
              accessibilityLabel="Business Address"
            />
          </View>
        )}

        <View style={styles.fieldContainer}>
          <Icon name="web" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Has Website?</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasWebsite === "No" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasWebsite("No")}
              accessibilityLabel="Website: No"
            >
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasWebsite === "Yes" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasWebsite("Yes")}
              accessibilityLabel="Website: Yes"
            >
              <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {hasWebsite === "Yes" && (
          <View style={styles.fieldContainer}>
            <Icon name="web" size={20} color={colors.textDark} style={styles.icon} />
            <Text style={styles.label}>Business Website</Text>
            <TextInput
              style={styles.input}
              value={businessWebsite}
              onChangeText={setBusinessWebsite}
              placeholder="Enter your website URL"
              keyboardType="url"
              placeholderTextColor={colors.textLight}
              accessibilityLabel="Business Website"
            />
          </View>
        )}

        <View style={styles.fieldContainer}>
          <Icon name="instagram" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Has Instagram?</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasInstagram === "No" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasInstagram("No")}
              accessibilityLabel="Instagram: No"
            >
              <Text style={styles.optionText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                hasInstagram === "Yes" && styles.optionButtonSelected,
              ]}
              onPress={() => setHasInstagram("Yes")}
              accessibilityLabel="Instagram: Yes"
            >
              <Text style={styles.optionText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {hasInstagram === "Yes" && (
          <View style={styles.fieldContainer}>
            <Icon name="instagram" size={20} color={colors.textDark} style={styles.icon} />
            <Text style={styles.label}>Business Instagram</Text>
            <TextInput
              style={styles.input}
              value={businessInstagram}
              onChangeText={setBusinessInstagram}
              placeholder="Enter your Instagram handle (e.g., @username)"
              placeholderTextColor={colors.textLight}
              accessibilityLabel="Business Instagram"
            />
          </View>
        )}
      </View>

      {/* Terms and Conditions Checkbox */}
      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
          accessibilityLabel="Accept Terms and Conditions"
        >
          <Icon
            name={acceptedTerms ? "checkbox-marked" : "checkbox-blank-outline"}
            size={24}
            color={acceptedTerms ? colors.primary : colors.textLight}
          />
          <Text style={styles.termsText}>
            I accept the{" "}
            <Text style={styles.termsLink} onPress={toggleTermsModal}>
              Terms and Conditions
            </Text>
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, !acceptedTerms && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        activeOpacity={0.7}
        disabled={!acceptedTerms}
      >
        <Text style={styles.submitButtonText}>Submit Application</Text>
      </TouchableOpacity>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={termsModalVisible}
        onRequestClose={toggleTermsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Terms and Conditions</Text>
              <TouchableOpacity onPress={toggleTermsModal}>
                <Icon name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                {/* Replace with your actual Terms and Conditions */}
                Welcome to our Vendor Program. By submitting this application, you agree to the following terms:

                {"\n\n"}1. **Eligibility**: You must be a registered business to apply as a vendor.
                {"\n"}2. **Responsibilities**: Vendors are responsible for maintaining accurate business information.
                {"\n"}3. **Fees**: A commission fee may apply on sales made through our platform.
                {"\n"}4. **Termination**: We reserve the right to terminate vendor accounts for non-compliance.
                {"\n"}5. **Data Privacy**: Your information will be handled in accordance with our Privacy Policy.

                {"\n\n"}For the full Terms and Conditions, please visit{" "}
                <Text style={styles.termsLink} onPress={openTermsLink}>
                  our website
                </Text>.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleTermsModal}>
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <VendorConfirmationSheet
        visible={isConfirmationSheetVisible}
        onClose={() => setIsConfirmationSheetVisible(false)}
        formData={{
          fullName,
          address,
          city,
          state,
          phone,
          email,
          preferredContact,
          businessName,
          businessCategory,
          hasPhysicalLocation,
          ...(hasPhysicalLocation === "Yes" && { businessAddress }),
          hasWebsite,
          ...(hasWebsite === "Yes" && { businessWebsite }),
          hasInstagram,
          ...(hasInstagram === "Yes" && { businessInstagram }),
        }}
        userId={user?.uid}
        onSuccess={resetForm}
        navigation={navigation} // Pass navigation prop
      />
    </ScrollView>
  );
};

export default VendorScreen;