import React, { useEffect, useState, useContext } from "react";
import { View, Text, Modal, TouchableOpacity, Platform } from "react-native";
import { db } from "../config/firebaseConfig";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/DeliveryListenerStyles";

const DeliveryListener = ({ navigation }) => {
    const [deliveredShipment, setDeliveredShipment] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [expoPushToken, setExpoPushToken] = useState("");

    const { user } = useContext(AuthContext);
    const userId = user ? user.uid : null;

    // Fetch Expo Push Token
    useEffect(() => {
        const registerForPushNotifications = async () => {
            if (!Device.isDevice) {
                return;
            }

            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;
            setExpoPushToken(token);
        };

        registerForPushNotifications();

        // Handle foreground notifications
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);

    // Listen for delivery updates
    useEffect(() => {
        if (!userId) {
            return;
        }

        if (!expoPushToken) {
            return;
        }


        const shipmentsQuery = query(
            collection(db, "shipments"),
            where("userId", "==", userId),
            where("status", "==", "Delivered")
        );

        const unsubscribe = onSnapshot(
            shipmentsQuery,
            (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (
                        change.type === "modified" &&
                        change.doc.data().status === "Delivered" &&
                        !change.doc.data().userConfirmed
                    ) {
                        const shipment = { id: change.doc.id, ...change.doc.data() };
                        handleDelivery(shipment);
                    }
                });
            },
            (error) => {
                console.error("Error in delivery listener:", error);
            }
        );

        return () => unsubscribe();
    }, [userId, expoPushToken]);

    const sendPushNotification = async (shipment) => {
        const message = {
            to: expoPushToken,
            sound: "default",
            title: "Package Delivered!",
            body: `Your package #${shipment.trackingNumber} has been delivered. Please confirm receipt.`,
            data: { shipmentId: shipment.id },
        };

        try {
            if (process.env.EXPO_PUBLIC_USE_EXPO_GO === "true") {
                return;
            }

            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Accept-encoding": "gzip, deflate",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
            });
        } catch (error) {
            console.error("Error sending push notification:", error);
        }
    };

    const handleDelivery = async (shipment) => {
        setDeliveredShipment(shipment);

        await sendPushNotification(shipment);

        try {
            await axios.post("https://your-backend-api.com/send-delivery-email", {
                userEmail: shipment.userEmail,
                trackingNumber: shipment.trackingNumber,
                receiverName: shipment.receiverName,
            });
        } catch (error) {
            console.error("Error sending email command:", error);
        }

        setShowConfirmModal(true);
    };

    const handleConfirmation = async (confirmed) => {
        if (!deliveredShipment) return;

        const shipmentRef = doc(db, "shipments", deliveredShipment.id);
        try {
            await updateDoc(shipmentRef, {
                userConfirmed: confirmed,
                confirmationTimestamp: new Date().toISOString(),
            });

            setShowConfirmModal(false);
            if (confirmed) {
                setShowRatingModal(true);
            } else {
                setDeliveredShipment(null);
            }
        } catch (error) {
            console.error("Error saving confirmation:", error);
        }
    };

    const handleRating = async (selectedRating) => {
        if (!deliveredShipment) return;

        const shipmentRef = doc(db, "shipments", deliveredShipment.id);
        try {
            await updateDoc(shipmentRef, {
                rating: selectedRating,
                ratingTimestamp: new Date().toISOString(),
            });

            setShowRatingModal(false);
            setDeliveredShipment(null);
            navigation.navigate("Track");
        } catch (error) {
            console.error("Error saving rating:", error);
        }
    };

    return (
        <>
            {/* Confirmation Modal */}
            <Modal visible={showConfirmModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Package Delivered</Text>
                        <Text style={styles.modalText}>
                            Your package #{deliveredShipment?.trackingNumber} has been marked as delivered.
                            Please confirm if you’ve received it.
                        </Text>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => handleConfirmation(true)}>
                                <Text style={styles.buttonText}>Yes, Received</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.declineButton} onPress={() => handleConfirmation(false)}>
                                <Text style={styles.buttonText}>No, Not Received</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Rating Modal */}
            <Modal visible={showRatingModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rate Your Experience</Text>
                        <Text style={styles.modalText}>How would you rate our service for this delivery?</Text>
                        <View style={styles.ratingRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                                    <Icon
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={40}
                                        color={star <= rating ? "#FFD700" : "#666"}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default DeliveryListener;
