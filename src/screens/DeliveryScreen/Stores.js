import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import StoreProductsModal from "./StoreProductsModal";
import styles from "../../styles/StoresStyles";
import colors from "../../styles/colors";

const Stores = ({ stores }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);

    const handleStorePress = (store) => {
        setSelectedStore(store);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedStore(null);
    };

    // Function to convert 24-hour format to 12-hour AM/PM format
    const formatHours = (hours) => {
        if (!hours) return "Not Available";

        const [openTime, closeTime] = hours.split("-");
        const formatTime = (time) => {
            const [hour, minute] = time.split(":").map(Number);
            const period = hour >= 12 ? "pm" : "am";
            const adjustedHour = hour % 12 || 12; // Convert 0 to 12 for midnight/noon
            return `${adjustedHour}${minute === 0 ? "" : `:${minute.toString().padStart(2, "0")}`}${period}`;
        };
        return `${formatTime(openTime)}-${formatTime(closeTime)}`;
    };

    // Function to check if a store is open based on current day and time
    const isStoreOpen = (hours) => {
        if (!hours || typeof hours !== "object") return false;

        const now = new Date();
        const day = now.toLocaleString("en-US", { weekday: "long" }); // e.g., "Monday"
        const todayHours = hours[day];
        if (!todayHours) return false; // Closed if no hours for today

        const [openTime, closeTime] = todayHours.split("-");
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const [openHour, openMinute] = openTime.split(":").map(Number);
        const [closeHour, closeMinute] = closeTime.split(":").map(Number);
        const openTimeInMinutes = openHour * 60 + openMinute;
        const closeTimeInMinutes = closeHour * 60 + closeMinute;

        // Handle overnight hours (e.g., 22:00-06:00)
        if (closeTimeInMinutes < openTimeInMinutes) {
            return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
        }
        return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
    };

    const renderStoreItem = ({ item }) => {
        const [_, __, city, state] = item.address.split(", ");
        const now = new Date();
        const day = now.toLocaleString("en-US", { weekday: "long" });
        const todayHours = item.hours && item.hours[day] ? item.hours[day] : null;
        const isOpen = isStoreOpen(item.hours);
        const displayHours = todayHours ? formatHours(todayHours) : "Closed Today";

        return (
            <TouchableOpacity style={styles.storeItem} onPress={() => handleStorePress(item)}>
                <Image source={{ uri: item.image }} style={styles.storeImage} />
                <View style={styles.storeInfo}>
                    <Text style={styles.storeName}>{item.name}</Text>
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

export default Stores;