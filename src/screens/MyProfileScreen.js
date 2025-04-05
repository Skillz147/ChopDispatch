import React, { useContext, useState, useEffect } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Added for icons
import { AuthContext } from "../context/AuthContext"; // Your exact import
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/lottie/loading.json";
import ProfilePicture from "./Profile/ProfilePicture"; // Your exact import
import UserInfo from "./Profile/UserInfo";
import AddressList from "./Profile/AddressList";
import AddressForm from "./Profile/AddressForm";
import styles from "../styles/MyProfileScreenStyles"; // Your exact import
import colors from "styles/colors";

const MyProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndAddresses = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ");
        }

        const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const addressList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAddresses(addressList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndAddresses();
  }, [user]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView source={loadingAnimation} autoPlay loop style={styles.lottie} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 40}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="image-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                <Text style={styles.sectionTitle}>Profile Picture</Text>
              </View>
              <ProfilePicture user={user} profilePic={profilePic} setProfilePic={setProfilePic} />
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="person-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                <Text style={styles.sectionTitle}>User Details</Text>
              </View>
              <UserInfo user={user} />
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="location-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                <Text style={styles.sectionTitle}>Saved Addresses</Text>
              </View>
              <AddressList addresses={addresses} setAddresses={setAddresses} setShowAddressForm={setShowAddressForm} />
            </View>
            {showAddressForm && (
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="add-circle-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                  <Text style={styles.sectionTitle}>Add Address</Text>
                </View>
                <AddressForm
                  user={user}
                  addresses={addresses}
                  setAddresses={setAddresses}
                  showAddressForm={showAddressForm}
                  setShowAddressForm={setShowAddressForm}
                  newAddress={newAddress}
                  setNewAddress={setNewAddress}
                />
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

export default MyProfileScreen;