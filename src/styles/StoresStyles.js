import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    storesContainer: {
        paddingBottom: 20,
    },
    storeItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    storeImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    storeInfo: {
        flex: 1,
        marginLeft: 15,
    },
    storeName: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    storeLocation: {
        fontSize: 14,
        fontWeight: "400",
        color: colors.textLight,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textDark,
        marginLeft: 5,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    hoursContainer: {
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hoursText: {
        fontSize: 12,
        fontWeight: "400",
        color: colors.textLight,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    statusText: {
        fontSize: 12,
        fontWeight: "600",
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
});