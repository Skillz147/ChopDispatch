import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Animated, Easing, TouchableOpacity, Image, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { db } from "../config/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import styles from "../styles/TrackDetailsScreenStyles";
import colors from "../styles/colors"; // Adjust path

const TrackDetailsScreen = ({ route, navigation }) => {
    const { shipment } = route.params;
    const [liveShipment, setLiveShipment] = useState(shipment);
    const [bikeAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        const shipmentRef = doc(db, "shipments", shipment.id);

        const unsubscribe = onSnapshot(
            shipmentRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const updatedShipment = { id: docSnapshot.id, ...docSnapshot.data() };
                    setLiveShipment(updatedShipment);

                    if (updatedShipment.status !== shipment.status) {
                        animateBike();
                    }
                }
            },
            (error) => {
                console.error("Error fetching live shipment:", error);
            }
        );

        return () => unsubscribe();
    }, [shipment.id]);

    const animateBike = () => {
        bikeAnimation.setValue(0);
        Animated.sequence([
            Animated.timing(bikeAnimation, {
                toValue: 1,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
            Animated.timing(bikeAnimation, {
                toValue: 0,
                duration: 500,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    };

    const bikeTranslateX = bikeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 15], // Slightly larger movement
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "#FFA500"; // Orange
            case "In Progress": return colors.flagship; // #004D40
            case "Delivered": return "#34C759"; // Green
            default: return "#666"; // Grey
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Tracking #{liveShipment.trackingNumber}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Status Section */}
                <View style={styles.statusCard}>
                    <Animated.View style={[styles.bikeContainer, { transform: [{ translateX: bikeTranslateX }] }]}>
                        <Icon name="motorbike" size={50} color={getStatusColor(liveShipment.status)} />
                    </Animated.View>
                    <Text style={[styles.statusText, { color: getStatusColor(liveShipment.status) }]}>
                        {liveShipment.status}
                    </Text>
                    <Text style={styles.statusSubText}>
                        {liveShipment.status === "Pending" ? "Awaiting Rider" :
                         liveShipment.status === "In Progress" ? "On the Way" : "Completed"}
                    </Text>
                </View>

                {/* Route Section */}
                <View style={styles.routeCard}>
                    <View style={styles.routePoint}>
                        <Icon name="map-marker" size={28} color={colors.flagship} />
                        <View style={styles.routeDetails}>
                            <Text style={styles.routeLabel}>Pickup</Text>
                            <Text style={styles.routeText}>{liveShipment.pickupAddress}</Text>
                            <Text style={styles.routeSubText}>{liveShipment.pickupLandmark}</Text>
                        </View>
                    </View>
                    <View style={styles.routeLine}>
                        <Icon name="dots-vertical" size={24} color={colors.flagship} />
                    </View>
                    <View style={styles.routePoint}>
                        <Icon name="map-marker-check" size={28} color="#34C759" />
                        <View style={styles.routeDetails}>
                            <Text style={styles.routeLabel}>Delivery</Text>
                            <Text style={styles.routeText}>{liveShipment.deliveryAddress}</Text>
                            <Text style={styles.routeSubText}>{liveShipment.deliveryLandmark}</Text>
                        </View>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.detailsCard}>
                    <View style={styles.detailItem}>
                        <Icon name="clock-outline" size={22} color={colors.flagship} />
                        <Text style={styles.detailText}>Booked: {new Date(liveShipment.createdAt).toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="account" size={22} color={colors.flagship} />
                        <Text style={styles.detailText}>Receiver: {liveShipment.receiverName}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="phone" size={22} color={colors.flagship} />
                        <Text style={styles.detailText}>Phone: {liveShipment.receiverNumber}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Icon name="cash" size={22} color={colors.flagship} />
                        <Text style={styles.detailText}>Cost: ₦{liveShipment.totalCost.toLocaleString()}</Text>
                    </View>
                    {liveShipment.urgent && (
                        <View style={styles.detailItem}>
                            <Icon name="alert" size={22} color="#FF5733" />
                            <Text style={styles.detailText}>Urgent Delivery</Text>
                        </View>
                    )}
                </View>

                {/* Proof of Delivery Section */}
                {liveShipment.proofOfDelivery && (
                    <View style={styles.proofCard}>
                        <Text style={styles.proofTitle}>Proof of Delivery</Text>
                        {liveShipment.status === "Delivered" && liveShipment.proofOfDeliveryUrl ? (
                            <TouchableOpacity onPress={() => ("")}>
                                <Image
                                    source={{ uri: liveShipment.proofOfDeliveryUrl }}
                                    style={styles.proofImage}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.proofFallbackContainer}>
                                <Image
                                    source={{ uri: "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }}
                                    style={styles.proofImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.proofText}>Package not yet delivered, no Proof yet</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default TrackDetailsScreen;