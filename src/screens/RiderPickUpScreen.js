import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/RiderPickUpStyles";
import PickupDetails from "./RiderPickUpScreen/PickupDetails";
import DeliveryDetails from "./RiderPickUpScreen/DeliveryDetails";
import PaymentSheet from "./RiderPickUpScreen/PaymentSheet";
import ConfirmationSheet from "./RiderPickUpScreen/ConfirmationSheet";
import { db, auth } from "../config/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import siteDetails from "../config/siteDetails.json";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
    }).format(amount);
};

const RiderPickUpScreen = () => {
    const initialFormState = {
        pickupAddress: "",
        pickupLandmark: "",
        pickFromName: "", // Added optional field
        pickupTime: new Date(),
        urgent: false,
        deliveryAddress: "",
        deliveryLandmark: "",
        receiverName: "",
        receiverNumber: "",
        proofOfDelivery: false,
        agreementAccepted: false,
    };

    const [formState, setFormState] = useState(initialFormState);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPaymentSheet, setShowPaymentSheet] = useState(false);
    const [showRiderConfirmation, setShowRiderConfirmation] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [trackingNumber, setTrackingNumber] = useState("");

    const baseCost = 2500;
    const urgentFee = 1000;
    const totalCost = formState.urgent ? baseCost + urgentFee : baseCost;

    const user = auth.currentUser;
    const userEmail = user ? user.email : "customer@example.com";

    const generateTrackingNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };
    

    const saveShipmentData = async (trackingNum) => {
        const shipmentData = {
            ...formState,
            pickupTime: formState.pickupTime.toISOString(),
            totalCost,
            trackingNumber: trackingNum,
            status: "Pending",
            createdAt: new Date().toISOString(),
            userId: user ? user.uid : null,
            userEmail,
        };
        try {
            await addDoc(collection(db, "shipments"), shipmentData);
        } catch (error) {
            console.error("Failed to save shipment:", error);
        }
    };

    const resetForm = () => {
        setFormState(initialFormState);
    };

    const handleConfirm = () => {
        if (!formState.agreementAccepted) {
            setFormState({ ...formState, agreementAccepted: true });
            return;
        }
        setShowPaymentSheet(true);
    };

    const handleOnRedirect = (data) => {
        setShowPaymentSheet(false);
        if (data.status === "successful" || data.status === "completed") {
            setPaymentStatus("success");
            const newTrackingNumber = generateTrackingNumber();
            setTrackingNumber(newTrackingNumber);
            saveShipmentData(newTrackingNumber);
            resetForm();
            setShowRiderConfirmation(true);
        } else {
            setPaymentStatus("failed");
            setShowRiderConfirmation(true);
        }
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.stickyHeader}>
                <Text style={styles.header}>{siteDetails.siteName} Rider Request</Text>
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} behavior="height" keyboardVerticalOffset={20}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <PickupDetails
                        pickupAddress={formState.pickupAddress}
                        setPickupAddress={(value) => setFormState({ ...formState, pickupAddress: value })}
                        pickupLandmark={formState.pickupLandmark}
                        setPickupLandmark={(value) => setFormState({ ...formState, pickupLandmark: value })}
                        pickFromName={formState.pickFromName} // Pass new field
                        setPickFromName={(value) => setFormState({ ...formState, pickFromName: value })} // Pass setter
                        pickupTime={formState.pickupTime}
                        setPickupTime={(value) => setFormState({ ...formState, pickupTime: value })}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        urgent={formState.urgent}
                        setUrgent={(value) => setFormState({ ...formState, urgent: value })}
                        urgentFee={urgentFee}
                        formatCurrency={formatCurrency}
                    />
                    <DeliveryDetails
                        deliveryAddress={formState.deliveryAddress}
                        setDeliveryAddress={(value) => setFormState({ ...formState, deliveryAddress: value })}
                        deliveryLandmark={formState.deliveryLandmark}
                        setDeliveryLandmark={(value) => setFormState({ ...formState, deliveryLandmark: value })}
                        receiverName={formState.receiverName}
                        setReceiverName={(value) => setFormState({ ...formState, receiverName: value })}
                        receiverNumber={formState.receiverNumber}
                        setReceiverNumber={(value) => setFormState({ ...formState, receiverNumber: value })}
                        proofOfDelivery={formState.proofOfDelivery}
                        setProofOfDelivery={(value) => setFormState({ ...formState, proofOfDelivery: value })}
                    />
                    <View style={styles.agreementContainer}>
                        <TouchableOpacity onPress={() => console.log("Terms link pressed")}>
                            <Text style={styles.agreementText}>Read {siteDetails.siteName} Terms & Agreement</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.stickyFooter}>
                <Text style={styles.costText}>Total: {formatCurrency(totalCost)}</Text>
                <TouchableOpacity
                    style={[styles.confirmButton, !formState.agreementAccepted && styles.buttonDisabled]}
                    onPress={handleConfirm}
                >
                    <Icon
                        name={formState.agreementAccepted ? "check" : "checkbox-blank-outline"}
                        size={24}
                        color="#FFFFFF"
                    />
                    <Text style={styles.buttonText}>{formState.agreementAccepted ? "Confirm" : "Accept"}</Text>
                </TouchableOpacity>
            </View>

            <PaymentSheet
                visible={showPaymentSheet}
                onClose={() => setShowPaymentSheet(false)}
                totalCost={totalCost}
                userEmail={userEmail}
                receiverNumber={formState.receiverNumber}
                receiverName={formState.receiverName}
                onRedirect={handleOnRedirect}
                formatCurrency={formatCurrency}
            />

            {showRiderConfirmation && (
                <ConfirmationSheet
                    visible={showRiderConfirmation}
                    onClose={() => setShowRiderConfirmation(false)}
                    paymentStatus={paymentStatus}
                    trackingNumber={trackingNumber}
                />
            )}
        </SafeAreaView>
    );
};

export default RiderPickUpScreen;