// src/screens/MyProfileScreen.js
import React, { useContext, useState, useEffect } from "react";
import { View, Image, TouchableOpacity, Text, TextInput, ScrollView, Modal, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { uploadFileToIPFS } from "../utils/ipfsUpload";
import { db } from "../config/firebaseConfig";
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../assets/lottie/loading.json";
import styles from "../styles/MyProfileScreenStyles";
import colors from "../styles/colors";

const MyProfileScreen = () => {
  const { user } = useContext(AuthContext);
  const [profilePic, setProfilePic] = useState("https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
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
        } else {
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

  const requestPermissions = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (libraryStatus !== "granted") {
      Alert.alert("Permission Denied", "Gallery permission is required to pick an image.");
      return false;
    }
    if (cameraStatus !== "granted") {
      Alert.alert("Permission Denied", "Camera permission is required for camera access.");
      return false;
    }
    return true;
  };

  const handleUpload = async (file) => {
    try {
      const ipfsUrl = await uploadFileToIPFS(
        file,
        (progress) => (``),
        () => (""),
        (error) => console.error("Upload error:", error)
      );
      setProfilePic(ipfsUrl);
      await updateDoc(doc(db, "users", user.uid), { profilePic: ipfsUrl });
    } catch (error) {
      console.error("Profile pic upload failed:", error);
      Alert.alert("Upload Failed", "Failed to upload profile picture. Please try again.");
    }
    setShowOptions(false);
  };

  const handleDelete = async () => {
    setProfilePic("https://example.com/default-icon.png");
    await updateDoc(doc(db, "users", user.uid), { profilePic: null });
    setShowOptions(false);
  };

  const handlePickFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: `profile-pic-${Date.now()}.jpg`,
          type: "image/jpeg",
        };
        await handleUpload(file);
      } else {
      }
    } catch (error) {
      console.error("Error launching gallery:", error);
      Alert.alert("Error", "Failed to open gallery. Please try again.");
    }
    setShowOptions(false);
  };

  const handlePickFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: `profile-pic-${Date.now()}.jpg`,
          type: "image/jpeg",
        };
        await handleUpload(file);
      }
    } catch (error) {
      console.error("Error launching camera:", error);
      Alert.alert("Error", "Failed to open camera. Please try again.");
    }
    setShowOptions(false);
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const addressData = {
      userId: user.uid,
      address: newAddress,
      customName: "New Address",
      landmark: "",
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, "addresses"), addressData);
    setAddresses([...addresses, { id: docRef.id, ...addressData }]);
    setNewAddress("");
    setShowAddressForm(false);
  };

  const handleDeleteAddress = async (addressId) => {
    await deleteDoc(doc(db, "addresses", addressId));
    setAddresses(addresses.filter((addr) => addr.id !== addressId));
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={loadingAnimation}
            autoPlay
            loop
            style={styles.lottie}
          />
        </View>
      ) : (
        <ScrollView>
          {/* Profile Picture */}
          <View style={styles.profilePicContainer}>
            <TouchableOpacity onPress={() => setIsExpanded(true)}>
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
              <TouchableOpacity
                style={styles.pencilIcon}
                onPress={() => setShowOptions(!showOptions)}
                accessible={true}
                accessibilityLabel="Edit Profile Picture"
              >
                <Ionicons name="pencil" size={20} color={colors.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
            {showOptions && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handlePickFromGallery}
                  accessible={true}
                  accessibilityLabel="Pick from Gallery"
                >
                  <Text style={styles.optionText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handlePickFromCamera}
                  accessible={true}
                  accessibilityLabel="Take Photo with Camera"
                >
                  <Text style={styles.optionText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={handleDelete}
                  accessible={true}
                  accessibilityLabel="Delete Profile Picture"
                >
                  <Text style={styles.optionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Expanded Profile Picture Modal */}
          <Modal visible={isExpanded} transparent animationType="fade">
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setIsExpanded(false)}
                accessible={true}
                accessibilityLabel="Close Expanded Image"
              >
                <Image source={{ uri: profilePic }} style={styles.expandedProfilePic} />
                <TouchableOpacity
                  style={styles.closeModalButton}
                  onPress={() => setIsExpanded(false)}
                  accessible={true}
                  accessibilityLabel="Close Modal"
                >
                  <Ionicons name="close" size={30} color={colors.surface} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <View style={styles.detailContainer}>
              <Ionicons name="person" size={20} color={colors.textDark} style={styles.detailIcon} />
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoText}>{user?.displayName || "Not set"}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Ionicons name="mail" size={20} color={colors.textDark} style={styles.detailIcon} />
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoText}>{user?.email || "Not set"}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Ionicons name="call" size={20} color={styles.textDark} style={styles.detailIcon} />
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoText}>{user?.phone || "Not set"}</Text>
            </View>
          </View>

          {/* Address List */}
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Addresses</Text>
            {addresses.map((addr) => (
              <View key={addr.id} style={styles.addressCard}>
                <Text style={styles.addressText}>{addr.address} ({addr.customName})</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAddress(addr.id)}
                  accessible={true}
                  accessibilityLabel={`Delete Address ${addr.customName}`}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddressForm(true)}
              accessible={true}
              accessibilityLabel="Add New Address"
            >
              <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
          </View>

          {/* Add New Address Form */}
          {showAddressForm && (
            <View style={styles.addAddressContainer}>
              <TextInput
                value={newAddress}
                onChangeText={setNewAddress}
                placeholder="Enter new address"
                style={styles.addressInput}
                accessible={true}
                accessibilityLabel="New Address Input"
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddAddress}
                  accessible={true}
                  accessibilityLabel="Save New Address"
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddressForm(false)}
                  accessible={true}
                  accessibilityLabel="Cancel Address Form"
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default MyProfileScreen;