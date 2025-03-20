import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/PickUpDetailsStyles";
import colors from "../../styles/colors"; // Adjust path as needed

const PickupDetails = ({
    pickupAddress,
    setPickupAddress,
    pickupLandmark,
    setPickupLandmark,
    pickupTime,
    setPickupTime,
    showDatePicker,
    setShowDatePicker,
    urgent,
    setUrgent,
    urgentFee,
    formatCurrency,
    pickFromName, // New optional field
    setPickFromName, // Setter for pickFromName
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
            <Text style={styles.sectionTitle}>Pickup Details</Text>
            <View style={styles.inputContainer}>
                <View style={styles.iconLabel}>
                    <Icon name="map-marker" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Pickup Address</Text>
                </View>
                <TextInput
                    style={getInputStyle("pickupAddress")}
                    placeholder="Enter pickup address"
                    value={pickupAddress}
                    onChangeText={setPickupAddress}
                    onFocus={() => setFocusedInput("pickupAddress")}
                    onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.iconLabel}>
                    <Icon name="map-marker-radius" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Landmark</Text>
                </View>
                <TextInput
                    style={getInputStyle("pickupLandmark")}
                    placeholder="Enter landmark (optional)"
                    value={pickupLandmark}
                    onChangeText={setPickupLandmark}
                    onFocus={() => setFocusedInput("pickupLandmark")}
                    onBlur={() => setFocusedInput(null)}
                />
                <View style={styles.iconLabel}>
                    <Icon name="account-outline" size={24} color={colors.flagship} />
                    <Text style={styles.label}>Pick From Name (Optional)</Text>
                </View>
                <TextInput
                    style={getInputStyle("pickFromName")}
                    placeholder="Enter sender's name (optional)"
                    value={pickFromName}
                    onChangeText={setPickFromName}
                    onFocus={() => setFocusedInput("pickFromName")}
                    onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                    style={styles.datePicker}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Icon name="calendar-clock" size={24} color={colors.flagship} />
                    <Text style={styles.dateText}>{pickupTime.toLocaleString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={pickupTime}
                        mode="datetime"
                        display="default"
                        onChange={(event, date) => {
                            setShowDatePicker(false);
                            if (date) setPickupTime(date);
                        }}
                    />
                )}
            </View>
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Urgent Pickup (+{formatCurrency(urgentFee)})</Text>
                <Switch
                    value={urgent}
                    onValueChange={setUrgent}
                    trackColor={{ false: "#C7C7CC", true: colors.flagship }} // Use #004D40 when enabled
                    thumbColor={urgent ? "#FFFFFF" : "#F4F4F4"}
                />
            </View>
        </View>
    );
};

export default PickupDetails;