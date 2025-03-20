// src/styles/VendorStatusSheetStyles.js
import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: height * 0.6, // Increased to fit more content
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  lottie: {
    width: 120, // Slightly larger for visual impact
    height: 120,
  },
  message: {
    fontSize: 18, // Larger for emphasis
    fontWeight: "bold",
    color: colors.textDark,
    textAlign: "center",
    marginVertical: 10,
  },
  subMessage: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginBottom: 20, // More space before button
    lineHeight: 20, // Improved readability for longer text
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
  },
});