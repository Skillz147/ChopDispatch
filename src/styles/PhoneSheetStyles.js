import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    authContainer: {
        backgroundColor: colors.surface,
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: "center",
        width: "100%",
        marginTop: "auto",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: -20,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    titleIcon: {
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.flagship,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    phoneInputContainer: {
        width: "100%",
        height: 60,
        borderRadius: 10,
        backgroundColor: colors.background,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    phoneTextContainer: {
        backgroundColor: colors.background,
        borderRadius: 10,
        paddingVertical: 5,
    },
    phoneTextInput: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    codeText: {
        fontSize: 16,
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginTop: 15,
        backgroundColor: colors.background,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: `${colors.textLight}30`,
        paddingHorizontal: 10,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.textDark,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        width: "100%",
        alignItems: "center", // Center vertically
        justifyContent: "center", // Center horizontally
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Center icon and text
        width: "auto", // Adjust to content width, centered within button
        paddingHorizontal: 20, // Increased padding for better balance
    },
    buttonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: "600",
        marginHorizontal: 8, // Symmetrical spacing
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    closeButton: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    closeButtonText: {
        color: colors.accent,
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 5,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
});