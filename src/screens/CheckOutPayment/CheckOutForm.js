import React, { useState, useEffect, useContext } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native";
import loadingAnimation from "../../../assets/lottie/loading.json";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../config/firebaseConfig";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import styles from "../../styles/CheckOutFormStyles";
import colors from "../../styles/colors";

const CheckOutForm = ({ onNext, setNextEnabled, setNextData }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [customName, setCustomName] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        setError("User not authenticated. Please log in.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        setName(user.fullName || user.displayName || "");
        setEmail(user.email || "");
        setPhone(user.phone || user.phoneNumber || "");

        const q = query(collection(db, "addresses"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const addresses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSavedAddresses(addresses);
      } catch (error) {
        console.error("Error loading saved addresses from Firestore:", error);
        setError("Failed to load addresses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  useEffect(() => {
    const isValid = name && address && phone && email;
    setNextEnabled(isValid);
    if (isValid) {
      setNextData({ name, address, landmark, phone, email, saveAddress, customName });
    } else {
      setNextData(null);
    }
  }, [name, address, landmark, phone, email, saveAddress, customName, setNextEnabled, setNextData]);

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setName(addr.name);
    setAddress(addr.address);
    setLandmark(addr.landmark);
    setPhone(addr.phone);
    setEmail(addr.email);
    setCustomName(addr.customName);
    setSaveAddress(false);
    setIsEditing(false);
  };

  const handleEditAddress = (addr) => {
    handleSelectAddress(addr);
    setIsEditing(true);
  };

  const handleSaveAddress = async () => {
    if (!name || !address || !phone || !email) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    const addressData = {
      userId: user.uid,
      name,
      address,
      landmark: landmark || "",
      phone,
      email,
      customName: customName || "Unnamed Address",
      createdAt: new Date().toISOString(),
    };

    try {
      if (isEditing && selectedAddress) {
        const addressRef = doc(db, "addresses", selectedAddress.id);
        await updateDoc(addressRef, addressData);
        setSavedAddresses((prev) =>
          prev.map((a) => (a.id === selectedAddress.id ? { id: a.id, ...addressData } : a))
        );
      } else {
        const docRef = await addDoc(collection(db, "addresses"), addressData);
        setSavedAddresses((prev) => [...prev, { id: docRef.id, ...addressData }]);
      }
      setSaveAddress(false);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving/updating address to Firestore:", error);
      setError("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderAddressItem = ({ item }) => (
    <View style={styles.addressItemContainer}>
      <TouchableOpacity
        style={[
          styles.addressItem,
          selectedAddress && selectedAddress.id === item.id && styles.addressItemSelected,
        ]}
        onPress={() => handleSelectAddress(item)}
        accessible={true}
        accessibilityLabel={`Select Address ${item.customName}`}
      >
        <Icon name="map-marker" size={20} color={colors.textDark} style={styles.icon} />
        <View style={styles.addressDetails}>
          <Text style={styles.addressText}>{item.customName}</Text>
          <Text style={styles.addressSubText}>{item.address}</Text>
          {item.landmark && <Text style={styles.addressSubText}>{item.landmark}</Text>}
          <Text style={styles.addressSubText}>{item.phone}</Text>
          <Text style={styles.addressSubText}>{item.email}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditAddress(item)}
        accessible={true}
        accessibilityLabel={`Edit Address ${item.customName}`}
      >
        <Icon name="pencil" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={loadingAnimation}
          autoPlay
          loop
          style={styles.lottie}
          accessible={true}
          accessibilityLabel="Loading Addresses"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
            loadData();
          }}
          accessible={true}
          accessibilityLabel="Retry Loading Addresses"
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (savedAddresses.length > 0 && !isEditing) {
    return (
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.title}>Delivery Details</Text>
            <Text style={styles.subtitle}>Saved Addresses</Text>
          </>
        }
        data={savedAddresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        style={styles.addressList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => {
              setSavedAddresses([]);
              setSelectedAddress(null);
              setIsEditing(false);
            }}
            accessible={true}
            accessibilityLabel="Add New Address"
          >
            <Icon name="plus" size={20} color={colors.primary} />
            <Text style={styles.addNewText}>Add New Address</Text>
          </TouchableOpacity>
        }
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Details</Text>
      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color={colors.textDark} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor={colors.darkBane}
          value={name}
          onChangeText={setName}
          accessible={true}
          accessibilityLabel="Full Name Input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="home" size={20} color={colors.textDark} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor={colors.darkBane}
          value={address}
          onChangeText={setAddress}
          accessible={true}
          accessibilityLabel="Address Input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="map-marker" size={20} color={colors.textDark} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Landmark (optional)"
          placeholderTextColor={colors.darkBane}
          value={landmark}
          onChangeText={setLandmark}
          accessible={true}
          accessibilityLabel="Landmark Input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="phone" size={20} color={colors.textDark} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor={colors.darkBane}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          accessible={true}
          accessibilityLabel="Phone Number Input"
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color={colors.textDark} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.darkBane}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          accessible={true}
          accessibilityLabel="Email Input"
        />
      </View>
      <View style={styles.saveToggle}>
        <Text style={styles.saveText}>Save this address?</Text>
        <Switch
          value={saveAddress}
          onValueChange={setSaveAddress}
          accessible={true}
          accessibilityLabel="Save Address Toggle"
        />
      </View>
      {saveAddress && (
        <>
          <View style={styles.inputContainer}>
            <Icon name="tag" size={20} color={colors.textDark} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Address Name (e.g., Home, Work)"
              placeholderTextColor={colors.darkBane}
              value={customName}
              onChangeText={setCustomName}
              accessible={true}
              accessibilityLabel="Address Name Input"
            />
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveAddress}
            accessible={true}
            accessibilityLabel={isEditing ? "Update Address" : "Save Address"}
          >
            <Text style={styles.saveButtonText}>{isEditing ? "Update Address" : "Save Address"}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default CheckOutForm;