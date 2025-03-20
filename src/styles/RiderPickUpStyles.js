import { StyleSheet } from "react-native";
import colors from "./colors"; // Adjust path if needed

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    stickyHeader: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.flagship, // Use flagship color for header background
        padding: 10,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#00332E", // Slightly darker shade for border
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        zIndex: 1000,
    },
    header: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        color: "#FFFFFF", // White text contrasts with #004D40
        
    },
    scrollContainer: {
        paddingTop: 80,
        paddingBottom: 100,
    },
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
        fontSize: 17,
        fontWeight: "600",
        color: colors.flagship, // Flagship color for section titles
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
    },
    datePicker: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#C7C7CC",
        marginTop: 8,
    },
    dateText: {
        fontSize: 16,
        marginLeft: 12,
        color: "#1C2526",
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
    },
    modalLogo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    modalClose: {
        marginTop: 15,
        padding: 12,
        backgroundColor: colors.flagship, // Flagship color for modal close button
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalCloseText: {
        color: "#FFFFFF",
        fontWeight: "600",
        fontSize: 17,
    },
    sheetOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    paymentSheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    sheetHandle: {
        width: 40,
        height: 5,
        backgroundColor: "#C7C7CC",
        borderRadius: 2.5,
        marginBottom: 15,
    },
    sheetLogo: {
        width: 80,
        height: 80,
        marginBottom: 20,
    },
    sheetTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: colors.flagship, // Flagship color for sheet title
        marginBottom: 10,
    },
    sheetAmount: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1C2526",
        marginBottom: 25,
    },
    sheetPayButton: {
        backgroundColor: colors.flagship, // Flagship color for pay button
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        width: "100%",
        alignItems: "center",
    },
    sheetButtonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    sheetCancelButton: {
        marginTop: 15,
        paddingVertical: 14,
        width: "100%",
        alignItems: "center",
    },
    sheetCancelText: {
        color: "#FF3B30",
        fontSize: 16,
        fontWeight: "600",
    },
    agreementContainer: {
        marginHorizontal: 15,
        marginVertical: 15,
        alignItems: "center",
    },
    agreementText: {
        fontSize: 16,
        color: colors.flagship, // Flagship color for agreement link
        textDecorationLine: "underline",
        marginBottom: 15,
    },
    stickyFooter: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        zIndex: 1000,
    },
    costText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.flagship, // Flagship color for total cost
    },
    confirmButton: {
        backgroundColor: colors.flagship, // Flagship color for confirm button
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#C7C7CC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "600",
        marginLeft: 8,
    },
});