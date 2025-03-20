// src/components/VendorStatusSheet.js
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import loadingAnimation from "../../assets/lottie/loading.json";
import pendingAnimation from "../../assets/lottie/pending.json"; // New import
import successAnimation from "../../assets/lottie/success.json"; // Updated path
import styles from "../styles/VendorStatusSheetStyles";
import colors from "../styles/colors";

const VendorStatusSheet = ({ visible, onClose, userId }) => {
  const [status, setStatus] = useState("loading"); // "loading", "pending", "approved", "rejected", "error"
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchApplicationStatus();
    }
  }, [visible]);

  const fetchApplicationStatus = async () => {
    try {
      setStatus("loading");
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().vendorApplicationId) {
        const appId = userDoc.data().vendorApplicationId;
        const appDocRef = doc(db, "vendorApplications", appId);
        const appDoc = await getDoc(appDocRef);

        if (appDoc.exists()) {
          const data = appDoc.data();
          setApplicationData(data);
          setStatus(data.status); // "pending", "approved", "rejected"
        } else {
          setStatus("error");
        }
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error fetching vendor status:", error);
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
            <Text style={styles.message}>Checking your application status...</Text>
          </View>
        );
      case "pending":
        return (
          <View style={styles.content}>
            <LottieView
              source={pendingAnimation}
              autoPlay
              loop
              style={styles.lottie}
            />
            <Text style={styles.message}>Application Under Review</Text>
            <Text style={styles.subMessage}>
              Thank you for applying to become a vendor! Your application is currently pending review. 
              Our team is carefully evaluating your submission, and we’ll notify you soon with the outcome. 
              Hang tight—this won’t take long!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case "approved":
        return (
          <View style={styles.content}>
            <LottieView
              source={successAnimation}
              autoPlay
              loop={false}
              style={styles.lottie}
            />
            <Text style={styles.message}>Welcome to the Vendor Team!</Text>
            <Text style={styles.subMessage}>
              Congratulations! Your vendor application has been approved. You’re now part of our elite 
              vendor community. Get ready to showcase your business, connect with customers, and grow 
              your brand with us. Your vendor account will be activated shortly—stay tuned for the 
              exciting journey ahead!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case "rejected":
        return (
          <View style={styles.content}>
            <Text style={styles.message}>Application Not Approved</Text>
            <Text style={styles.subMessage}>
              We regret to inform you that your vendor application was not approved at this time. 
              This could be due to specific criteria not being met. Please contact our support team 
              for detailed feedback or to address any questions. We’re here to help you try again!
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        );
      case "error":
        return (
          <View style={styles.content}>
            <Text style={styles.message}>Unable to Fetch Status</Text>
            <Text style={styles.subMessage}>
              Something went wrong while checking your application status. Please try again later or 
              contact support if the issue persists.
            </Text>
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

export default VendorStatusSheet;