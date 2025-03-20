import { StyleSheet } from "react-native";
import colors from "./colors"; // Adjust path as needed

export default StyleSheet.create({
    sectionContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginHorizontal: 15,
        marginBottom: 15,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.flagship, // Use flagship color #004D40
        padding: 15,
        backgroundColor: "#F7F7F8",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5EA",
    },
    inputContainer: {
        padding: 15,
    },
    iconLabel: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    label: {
        fontSize: 17,
        fontWeight: "500",
        marginLeft: 12,
        color: "#1C2526",
    },
    input: {
        borderWidth: 1,
        borderColor: "#C7C7CC",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#FFFFFF",
        marginTop: 8,
        marginBottom: 12,
        color: "#1C2526",
        // Enhanced: Add focus style in component
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
    },
});