import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: Platform.select({ ios: 10, android: 8 }), // Adjust padding for platform
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: width - 32, // Account for 16px padding on each side
  },
  searchContainerFocused: {
    borderWidth: 1,
    borderColor: colors.primary,
    shadowOpacity: 0.2,
  },
  searchIcon: {
    marginRight: 10,
  },
  loadingIndicator: {
    marginLeft: -20, // Adjust position to align with icon
  },
  searchInput: {
    flex: 1,
    fontSize: Platform.select({ ios: 16, android: 15 }), // Slight adjustment for Android
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    paddingVertical: 0, // Remove default padding to control it
  },
  clearButton: {
    padding: 5,
  },
});