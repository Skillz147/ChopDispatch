// src/styles/LoadingSheetStyles.js
import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors"; // Assuming you have a colors file

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: colors.surface || "#FFF", // Fallback to white if colors.surface isn’t defined
    borderRadius: 15,
    padding: 20,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  message: {
    fontSize: 16,
    color: colors.textDark || "#333", // Fallback to dark gray
    textAlign: "center",
    marginTop: 15,
    fontWeight: "500",
  },
});