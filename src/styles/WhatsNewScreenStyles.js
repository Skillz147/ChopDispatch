import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
    // WhatsNewScreen (List View)
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
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    announcementCard: {
        backgroundColor: colors.surface,
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 180,
        resizeMode: "cover",
    },
    contentContainer: {
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: colors.textDark,
        marginBottom: 10,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    metaContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    metaText: {
        fontSize: 14,
        color: colors.textLight,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    interactionContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: `${colors.textLight}20`,
    },
    interactionText: {
        fontSize: 14,
        color: colors.textDark,
        marginLeft: 5,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    likeButton: {
        flexDirection: "row",
        alignItems: "center",
    },

    // NewsDetailScreen (Detail View)
    detailContainer: {
        flex: 1,
        backgroundColor: colors.background,
        marginTop: 10,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        zIndex: 1,
        padding: 10,
        backgroundColor: colors.surface,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    detailImage: {
        width: "100%",
        height: 300,
        resizeMode: "cover",
    },
    detailContent: {
        padding: 20,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingTop: 30,
    },
    detailTitle: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.textDark,
        marginBottom: 15,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    detailMeta: {
        fontSize: 14,
        color: colors.textLight,
        marginBottom: 10,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    detailContentText: {
        fontSize: 16,
        color: colors.textDark,
        lineHeight: 26,
        marginBottom: 20,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    detailInteraction: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: `${colors.textLight}20`,
    },
    linkButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    linkButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
        fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    },
    linkIcon: {
        marginLeft: 5,
    },
});