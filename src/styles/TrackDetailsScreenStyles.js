import { StyleSheet } from "react-native";
import colors from "./colors"; // Adjust path as needed

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    header: {
        backgroundColor: colors.flagship, // #004D40 for header
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    backButton: {
        padding: 8,
    },
    headerText: {
        fontSize: 22,
        fontWeight: "700",
        color: "#FFFFFF", // White text contrasts with #004D40
        flex: 1,
        textAlign: "center",
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 30,
    },
    statusCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    bikeContainer: {
        marginBottom: 20,
    },
    statusText: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.flagship, // #004D40 for status (override in component)
    },
    statusSubText: {
        fontSize: 16,
        color: "#666",
        marginTop: 8,
        fontWeight: "500",
    },
    routeCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    routePoint: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginVertical: 12,
    },
    routeDetails: {
        flex: 1,
        marginLeft: 15,
    },
    routeLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.flagship, // #004D40 for labels
    },
    routeText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1C2526",
        marginTop: 4,
    },
    routeSubText: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
        fontWeight: "400",
    },
    routeLine: {
        alignItems: "center",
        marginVertical: 8,
    },
    detailsCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9F9FB",
        borderRadius: 12,
        padding: 15,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: "#E5E5EA",
    },
    detailText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#1C2526",
        marginLeft: 12,
        flex: 1,
    },
    proofCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginHorizontal: 15,
        marginBottom: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    proofTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.flagship, // #004D40
        marginBottom: 15,
    },
    proofImage: {
        width: "100%",
        height: 220, // Slightly taller for better visibility
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E5E5EA",
    },
    proofFallbackContainer: {
        alignItems: "center",
    },
    proofText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
        textAlign: "center",
        marginTop: 12,
        lineHeight: 22,
    },
});