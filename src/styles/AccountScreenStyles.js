// src/styles/AccountScreenStyles.js
import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1, // Allows content to grow within ScrollView
    paddingBottom: 20, // Adds space at the bottom for scrolling
  },
  headerContainer: {
    padding: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}30`,
  },
  userInfoContainer: {
    marginBottom: 10,
  },
  userNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  verifiedIcon: {
    marginLeft: 5,
  },
  roleText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginTop: 3,
  },
  contentContainer: {
    padding: 15,
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navIcon: {
    marginRight: 12,
    color: colors.primary,
  },
  navTextContainer: {
    flex: 1,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  navDescription: {
    fontSize: 13,
    color: colors.textLight,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginTop: 1,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: `${colors.textLight}30`,
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  footerButtonText: {
    fontSize: 14,
    color: colors.accent,
    marginLeft: 5,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  updateIconContainer: {
    position: "relative",
  },
  updateBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  floatingWidget: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  floatingButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "600",
  },

  
});