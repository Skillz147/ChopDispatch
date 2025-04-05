import React, { useState, useCallback } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StoreProductsModal from "./StoreProductsModal";
import styles from "../../styles/StoresStyles";
import colors from "../../styles/colors";
import { debounce } from "lodash";

const Stores = ({ stores }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const debouncedHandleStorePress = useCallback(
    debounce((store) => {
      setSelectedStore(store);
      setModalVisible(true);
      if (!isStoreOpen(store.hours)) {
        Alert.alert("Store Closed", "This store is currently closed. You can only view products.", [
          { text: "OK" },
        ]);
      }
    }, 300),
    []
  );

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedStore(null);
  };

  const handleVerificationPress = (store) => {
    if (store.isVerified) {
      Alert.alert("Verified Store", "This Store is fully verified by Chop Dispatch.", [
        { text: "OK" },
      ]);
    }
  };

  // Function to convert 24-hour format to 12-hour AM/PM format
  const formatHours = (hours) => {
    if (!hours) return "Not Available";

    const [openTime, closeTime] = hours.split("-");
    const formatTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour >= 12 ? "pm" : "am";
      const adjustedHour = hour % 12 || 12;
      return `${adjustedHour}${minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`}${period}`;
    };
    return `${formatTime(openTime)}-${formatTime(closeTime)}`;
  };

  // Function to check if a store is open
  const isStoreOpen = (hours) => {
    if (!hours || typeof hours !== "object") return false;

    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "long" });
    const todayHours = hours[day];
    if (!todayHours) return false;

    const [openTime, closeTime] = todayHours.split("-");
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;

    if (closeTimeInMinutes < openTimeInMinutes) {
      return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
    }
    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
  }, []);

  const renderStoreItem = ({ item }) => {
    const [_, __, city, state] = item.address.split(", ") || ["", "", "Unknown", "Location"];
    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "long" });
    const todayHours = item.hours && item.hours[day] ? item.hours[day] : null;
    const isOpen = isStoreOpen(item.hours);
    const displayHours = todayHours ? formatHours(todayHours) : "Closed Today";

    return (
      <TouchableOpacity
        style={styles.storeItem}
        onPress={() => debouncedHandleStorePress(item)}
        accessibilityLabel={`Store: ${item.name}, ${city}, ${state}, Rating: ${item.rating}, ${isOpen ? "Open" : "Closed"}`}
        accessibilityHint={isOpen ? "Tap to view products and add to cart" : "Tap to view products only, store is closed"}
      >
        <Image source={{ uri: item.image }} style={styles.storeImage} />
        <View style={styles.storeInfo}>
          <View style={styles.storeNameContainer}>
            <Text style={styles.storeName}>{item.name || "Unnamed Store"}</Text>
            {item.isVerified && (
              <TouchableOpacity
                onPress={() => handleVerificationPress(item)}
                accessibilityLabel="Verified Store"
                accessibilityHint="Tap to see verification details"
              >
                <Icon name="check-circle" size={20} color={colors.blue} style={styles.verifiedIcon} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.storeLocation}>{city}, {state}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={20} color={colors.gold} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.hoursContainer}>
            <Text style={styles.hoursText}>Hours: {displayHours}</Text>
            <Text style={[styles.statusText, { color: isOpen ? colors.primary : colors.accent }]}>
              {isOpen ? "Open" : "Closed"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.storesContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      {selectedStore && (
        <StoreProductsModal
          visible={modalVisible}
          store={selectedStore}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default React.memo(Stores);