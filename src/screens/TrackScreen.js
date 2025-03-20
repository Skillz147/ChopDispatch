import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, SafeAreaView, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db, auth } from "../config/firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import styles from "../styles/TrackScreenStyles";
import DeliveryListener from "./DeliveryListener"; // Adjust path
import colors from "../styles/colors"; // Adjust path

const TrackScreen = ({ navigation }) => {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current; // Fade animation for list

    const user = auth.currentUser;
    const userId = user ? user.uid : null;

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const shipmentsQuery = query(
            collection(db, "shipments"),
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(
            shipmentsQuery,
            (snapshot) => {
                const shipmentData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setShipments(shipmentData);
                setLoading(false);

                // Animate list fade-in
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            },
            (error) => {
                console.error("Error fetching shipments:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Pending":
                return { color: "#FFA500", backgroundColor: "rgba(255, 165, 0, 0.1)" }; // Orange
            case "In Progress":
                return { color: colors.flagship, backgroundColor: "rgba(0, 77, 64, 0.1)" }; // #004D40
            case "Delivered":
                return { color: "#34C759", backgroundColor: "rgba(52, 199, 89, 0.1)" }; // Green
            default:
                return { color: "#666", backgroundColor: "rgba(102, 102, 102, 0.1)" };
        }
    };

    const renderShipmentItem = ({ item }) => {
        const statusStyle = getStatusStyle(item.status);

        return (
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => navigation.navigate("TrackDetails", { shipment: item })}
            >
                <View style={styles.itemHeader}>
                    <View style={styles.trackingNumberContainer}>
                        <Icon name="package-variant-closed" size={20} color={colors.flagship} />
                        <Text style={styles.trackingNumberText}>{item.trackingNumber}</Text>
                    </View>
                    <Text style={[styles.status, statusStyle]}>{item.status}</Text>
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
                        {item.pickupAddress}
                    </Text>
                    <Icon name="arrow-right" size={20} color={colors.flagship} />
                    <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
                        {item.deliveryAddress}
                    </Text>
                </View>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.flagship} />
                <Text style={styles.loadingText}>Loading your bookings...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Track Your Riders</Text>
            </View>
            {shipments.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="package-variant-closed" size={60} color="#C7C7CC" />
                    <Text style={styles.emptyText}>No bookings found</Text>
                </View>
            ) : (
                <Animated.FlatList
                    data={shipments}
                    renderItem={renderShipmentItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    style={{ opacity: fadeAnim }}
                />
            )}
            <DeliveryListener navigation={navigation} />
        </SafeAreaView>
    );
};

export default TrackScreen;