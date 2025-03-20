import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Switch, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";
import colors from "../styles/colors";

const SettingsScreen = () => {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
    const { user } = useContext(AuthContext);

    const toggleNotifications = () => {
        setIsNotificationsEnabled((prev) => !prev);
        // Placeholder for enabling/disabling notifications
    };

    const handleClearData = async () => {
        try {
            if (user) {
                await AsyncStorage.removeItem(`cartItems_${user.uid}`);
                await AsyncStorage.removeItem(`favorites_${user.uid}`);
            }
            await AsyncStorage.removeItem("likedPosts");
            alert("Local data cleared successfully!");
        } catch (error) {
            console.error("Error clearing data:", error);
            alert("Failed to clear data. Please try again.");
        }
    };

    const handleSwitchTheme = () => {
        // Placeholder for theme switching
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Icon name="cog" size={28} color={colors.gold} style={styles.headerIcon} />
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.settingItem}>
                    <Text style={styles.settingLabel}>Enable Notifications</Text>
                    <Switch
                        onValueChange={toggleNotifications}
                        value={isNotificationsEnabled}
                        trackColor={{ false: colors.textLight, true: colors.primary }}
                        thumbColor={colors.surface}
                    />
                </View>
                <TouchableOpacity style={styles.settingItem} onPress={handleSwitchTheme}>
                    <Text style={styles.settingLabel}>Switch Theme</Text>
                    <Icon name="chevron-right" size={24} color={colors.textDark} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={handleClearData}>
                    <Text style={styles.settingLabel}>Clear Local Data</Text>
                    <Icon name="delete" size={24} color={colors.accent} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: `${colors.textLight}30`,
    },
    headerIcon: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.flagship,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    contentContainer: {
        padding: 20,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    settingLabel: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
});

export default SettingsScreen;