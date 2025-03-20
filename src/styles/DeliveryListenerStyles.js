import { StyleSheet } from "react-native";

export default StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        width: "85%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1C2526",
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    confirmButton: {
        backgroundColor: "#34C759",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
    },
    declineButton: {
        backgroundColor: "#FF3B30",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        flex: 1,
        marginLeft: 10,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    ratingRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 20,
    },
});