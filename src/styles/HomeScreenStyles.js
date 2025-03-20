import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  // Header styles
  headerContainer: {
    backgroundColor: colors.flagship, 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.flagship,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.surface,
  },
  highlight: {
    color: colors.surface,
  },
  switchButton: {
    backgroundColor: colors.gradientEnd,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  switchText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // Tab bar styles
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.flagship,
    paddingBottom: 5,
    height: 70, // Increased height to accommodate profile pic
  },
  tabIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  profileTabIcon: {
    width: 35, // Slightly larger than icon size for visibility
    height: 35,
    borderRadius: 5, // Circular
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  cartBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: "bold",
  },
  activeTabUnderline: {
    width: 24,
    height: 2,
    backgroundColor: colors.flagship,
    marginTop: 0,
  },

});