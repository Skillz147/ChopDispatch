import { StyleSheet } from "react-native";
import colors from "./colors"; // Adjust path as needed

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    header: {
        backgroundColor: colors.flagship, // #004D40 for header
        padding: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "700",
        color: "#FFFFFF", // White contrasts with #004D40
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "500",
        color: colors.flagship, // #004D40
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: "500",
        color: "#666",
    },
    listContainer: {
        padding: 20,
        paddingBottom: 30,
    },
    itemContainer: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderLeftWidth: 4,
        borderLeftColor: colors.flagship, // #004D40 accent
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    trackingNumberContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    trackingNumberText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.flagship, // #004D40
        marginLeft: 5, // Space between icon and text
    },
    status: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.flagship, // Default to #004D40, overridden in component
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: "rgba(0, 77, 64, 0.1)", // Light #004D40 tint
    },
    itemDetails: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    address: {
        fontSize: 14,
        fontWeight: "500",
        color: "#1C2526",
        flex: 1,
        textAlign: "left",
        marginHorizontal: 8,
    },
    date: {
        fontSize: 12,
        fontWeight: "400",
        color: "#999",
        textAlign: "right",
    },
});