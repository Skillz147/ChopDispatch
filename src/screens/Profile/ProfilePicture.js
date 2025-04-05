import React, { useState } from "react";
import { View, Image, TouchableOpacity, Modal, Text, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons"; // Your exact import
import { uploadFileToIPFS } from "../../utils/ipfsUpload";
import { db } from "../../config/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import Toast from "react-native-toast-message"; // Added for toast notifications
import styles from "../../styles/ProfilePictureStyles"; // Your exact import
import colors from "../../styles/colors"; // Your exact import

const ProfilePicture = ({ user, profilePic, setProfilePic }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [uploading, setUploading] = useState(false); // Added for upload indicator

  const requestPermissions = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    if (libraryStatus !== "granted" || cameraStatus !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Camera and gallery permissions are required.",
      });
      return false;
    }
    return true;
  };

  const handleUpload = async (file) => {
    setUploading(true); // Show spinner
    setShowOptions(false); // Close options immediately
    try {
      const ipfsUrl = await uploadFileToIPFS(file, (progress) => {}, () => {}, (error) => console.error("Upload error:", error));
      await updateDoc(doc(db, "users", user.uid), { profilePic: ipfsUrl });
      setProfilePic(ipfsUrl);
      Toast.show({
        type: "success",
        text1: "Upload Successful",
        text2: "Profile picture updated!",
      });
    } catch (error) {
      console.error("Profile pic upload failed:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Failed to upload profile picture.",
      });
    } finally {
      setUploading(false); // Hide spinner
    }
  };

  const handleDelete = async () => {
    setUploading(true); // Show spinner for delete too
    setShowOptions(false); // Close options
    try {
      await updateDoc(doc(db, "users", user.uid), { profilePic: null });
      setProfilePic("https://example.com/default-icon.png");
      Toast.show({
        type: "success",
        text1: "Deleted",
        text2: "Profile picture removed.",
      });
    } catch (error) {
      console.error("Profile pic delete failed:", error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Failed to remove profile picture.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handlePickFromGallery = async () => {
    if (!(await requestPermissions())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const file = { uri: result.assets[0].uri, name: `profile-pic-${Date.now()}.jpg`, type: "image/jpeg" };
      await handleUpload(file);
    }
  };

  const handlePickFromCamera = async () => {
    if (!(await requestPermissions())) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const file = { uri: result.assets[0].uri, name: `profile-pic-${Date.now()}.jpg`, type: "image/jpeg" };
      await handleUpload(file);
    }
  };

  return (
    <View style={styles.profilePicContainer}>
      <TouchableOpacity onPress={() => setIsExpanded(true)} disabled={uploading}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        {uploading && (
          <View style={styles.uploadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
        <TouchableOpacity
          style={styles.pencilIcon}
          onPress={() => setShowOptions(!showOptions)}
          accessibilityLabel="Edit Profile Picture"
          disabled={uploading}
        >
          <Ionicons name="pencil" size={25} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
      {showOptions && (
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handlePickFromGallery} accessibilityLabel="Pick from Gallery">
            <Text style={styles.optionText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handlePickFromCamera} accessibilityLabel="Take Photo with Camera">
            <Text style={styles.optionText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleDelete} accessibilityLabel="Delete Profile Picture">
            <Text style={styles.optionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal visible={isExpanded} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setIsExpanded(false)}
          activeOpacity={1}
          accessibilityLabel="Close Expanded Image"
        >
          <Image source={{ uri: profilePic }} style={styles.expandedProfilePic} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ProfilePicture;