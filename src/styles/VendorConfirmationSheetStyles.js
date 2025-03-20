// src/styles/VendorConfirmationSheetStyles.js
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
    maxHeight: height * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  lottie: {
    width: 100,
    height: 100,
  },
  message: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    marginVertical: 10,
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