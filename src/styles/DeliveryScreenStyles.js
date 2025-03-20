import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // #F5F5F5
    },
    searchSection: {
        padding: 15,
        backgroundColor: colors.surface, // #FFFFFF
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    categoriesSection: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: colors.surface,
    },
    locationsSection: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: colors.surface,
    },
    locationsContainer: {
        paddingVertical: 5,
    },
    locationCardWrapper: {
        marginRight: 10,
    },
    locationCard: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    locationIcon: {
        marginRight: 6,
    },
    locationText: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    locationTextActive: {
        color: colors.primary,
        fontWeight: "600",
    },
    headerSection: {
        padding: 15,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.textLight + "20",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.flagship,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    subHeaderText: {
        fontSize: 14,
        fontWeight: "500",
        color: colors.textLight,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
        marginTop: 5,
    },
    storesSection: {
        flex: 1,
        padding: 15,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    noStoresContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noStoresAnimation: {
        width: 200,
        height: 200,
    },
    noStoresText: {
        fontSize: 16,
        fontWeight: "500",
        color: colors.textDark,
        textAlign: "center",
        marginTop: 20,
        paddingHorizontal: 20,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
});