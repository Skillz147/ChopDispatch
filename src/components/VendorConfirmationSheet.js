// src/components/VendorConfirmationSheet.js
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import loadingAnimation from "../../assets/lottie/loading.json";
import successAnimation from "../../assets/lottie/success.json";
import styles from "../styles/VendorConfirmationSheetStyles";
import { useNavigation } from "@react-navigation/native"; // Add this import if using React Navigation

const VendorConfirmationSheet = ({ visible, onClose, formData, userId, onSuccess }) => {
  const navigation = useNavigation(); // Hook to access navigation
  const [status, setStatus] = useState("loading"); // "loading", "success", "error"

  useEffect(() => {
    if (visible) {
      submitApplication();
    }
  }, [visible]);

  const submitApplication = async () => {
    try {
      setStatus("loading");

      // Add form data to "vendorApplications" collection
      const applicationData = {
        ...formData,
        userId,
        submittedAt: new Date().toISOString(),
        status: "pending", // Initial status
      };
      const docRef = await addDoc(collection(db, "vendorApplications"), applicationData);

      // Update user's profile to mark vendor application submitted
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        hasAppliedForVendor: true,
        vendorApplicationId: docRef.id,
      });

      setStatus("success");
      setTimeout(() => {
        onSuccess(); // Reset form
        navigation.goBack(); // Navigate back to the previous screen
      }, 2000); // Show success animation for 2 seconds
    } catch (error) {
      console.error("Error submitting application:", error);
      setStatus("error");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <View style={styles.content}>
            <LottieView
              source={loadingAnimation}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.message}>Submitting your application...</Text>
          </View>
        );
      case "success":
        return (
          <View style={styles.content}>
            <LottieView
              source={successAnimation}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.message}>Application submitted successfully!</Text>
          </View>
        );
      case "error":
        return (
          <View style={styles.content}>
            <Text style={styles.message}>Failed to submit application. Please try again.</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>{renderContent()}</View>
      </View>
    </Modal>
  );
};

export default VendorConfirmationSheet;