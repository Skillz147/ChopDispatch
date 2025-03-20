import { StyleSheet, Dimensions } from "react-native";
import colors from "../styles/colors";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: height * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  animationContainer: {
    alignItems: "center",
  },
  lottie: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    marginVertical: 10,
  },
  note: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: "center",
    marginVertical: 10,
    fontStyle: "italic",
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
  progressBar: {
    marginVertical: 10,
  },
  progressText: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: 5,
  },
});