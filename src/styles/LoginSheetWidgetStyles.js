import { StyleSheet } from "react-native";
import colors from "./colors"; // Adjust path to your colors file

export default StyleSheet.create({
    floatingButton: {
        position: "absolute",
        bottom: 22,
        right: 20,
        backgroundColor: colors.flagship, // #004D40
        borderRadius: 10,
        width: 100, // Increased width to fit text
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
    },
    floatingButtonContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    floatingButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 5,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "flex-end", // Align to bottom like AuthSheet
    },
    keyboardAvoidingContainer: {
        width: "100%",
    },
    widgetContainer: {
        backgroundColor: colors.background, // #F5F5F5
        padding: 35,
        borderTopLeftRadius: 20, // Rounded top corners like AuthSheet
        borderTopRightRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    accountText: {
        fontSize: 18,
        fontWeight: "600",
        color: colors.flagship, // #004D40
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.textLight, // #777
        marginBottom: 15,
        paddingHorizontal: 10,
        width: "100%",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: colors.textDark, // #333
    },
    eyeButton: {
        padding: 10,
    },
    loginButton: {
        backgroundColor: colors.flagship, // #004D40
        paddingVertical: 12,
        borderRadius: 10,
        width: "100%",
        alignItems: "center",
        marginBottom: 15,
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        marginVertical: 15,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: colors.textLight, // #777
    },
    dividerText: {
        marginHorizontal: 10,
        fontSize: 14,
        color: colors.textLight, // #777
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginBottom: 20, // Added margin to ensure space above keyboard
    },
    iconButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.textLight, // #777
    },
    icon: {
        width: 40,
        height: 40,
        resizeMode: "contain",
    },
    loadingContainer: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    loadingIcon: {
        // No tint needed since it's colored via Icon props
    },
    loadingText: {
        fontSize: 16,
        color: colors.textDark, // #333
        marginTop: 10,
    },
});