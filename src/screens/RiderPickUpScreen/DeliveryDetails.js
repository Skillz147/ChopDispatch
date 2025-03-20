import React, { useState } from "react";
import { View, Text, TextInput, Switch } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/DeliveryDetailsStyles";
import colors from "../../styles/colors"; // Adjust path as needed

const DeliveryDetails = ({
    deliveryAddress,
    setDeliveryAddress,
    deliveryLandmark,
    setDeliveryLandmark,
    receiverName,
    setReceiverName,
    receiverNumber,
    setReceiverNumber,
    proofOfDelivery,
    setProofOfDelivery,
}) => {
    const [focusedInput, setFocusedInput] = useState(null); // Track focused input

    const getInputStyle = (field) => [
        styles.input,
        focusedInput === field && {
            borderColor: colors.flagship, // Highlight focused input with #004D40
            borderWidth: 2,
        },
    ];

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.inputContainer}>
                <View style={styles.iconLabel}>
                    <Icon name="truck-delivery" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Delivery Address</Text>
                </View>
                <TextInput
                    style={getInputStyle("deliveryAddress")}
                    placeholder="Enter delivery address"
                    value={deliveryAddress}
                    onChangeText={setDeliveryAddress}
                    onFocus={() => setFocusedInput("deliveryAddress")}
                    onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.iconLabel}>
                    <Icon name="map-marker-path" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Landmark</Text>
                </View>
                <TextInput
                    style={getInputStyle("deliveryLandmark")}
                    placeholder="Enter landmark (optional)"
                    value={deliveryLandmark}
                    onChangeText={setDeliveryLandmark}
                    onFocus={() => setFocusedInput("deliveryLandmark")}
                    onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.iconLabel}>
                    <Icon name="account-outline" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Receiver Name</Text>
                </View>
                <TextInput
                    style={getInputStyle("receiverName")}
                    placeholder="Enter receiver's name"
                    value={receiverName}
                    onChangeText={setReceiverName}
                    onFocus={() => setFocusedInput("receiverName")}
                    onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.iconLabel}>
                    <Icon name="phone" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Receiver Phone</Text>
                </View>
                <TextInput
                    style={getInputStyle("receiverNumber")}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    value={receiverNumber}
                    onChangeText={setReceiverNumber}
                    onFocus={() => setFocusedInput("receiverNumber")}
                    onBlur={() => setFocusedInput(null)}
                />
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Request Proof of Delivery</Text>
                <Switch
                    value={proofOfDelivery}
                    onValueChange={setProofOfDelivery}
                    trackColor={{ false: "#C7C7CC", true: colors.flagship }} // Use #004D40 when enabled
                    thumbColor={proofOfDelivery ? "#FFFFFF" : "#F4F4F4"}
                />
            </View>
        </View>
    );
};

export default DeliveryDetails;