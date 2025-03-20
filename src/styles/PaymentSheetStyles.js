import { StyleSheet, Dimensions } from "react-native";
import colors from "../styles/colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  paymentSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    maxHeight: "90%",
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.textLight,
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 15,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  sheetLogo: {
    width: 120,
    height: 60,
    marginBottom: 5,
  },
  logoTagline: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: "400",
    textAlign: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  processingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 15,
    textAlign: "center",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sheetAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.flagship,
    marginLeft: 10,
  },
  paymentInfo: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 10,
    textAlign: "center",
  },
  lottie: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  sheetPayButton: {
    backgroundColor: colors.flagship,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  sheetCancelButton: {
    borderWidth: 1,
    borderColor: colors.flagship,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "80%",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sheetButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
  sheetCancelText: {
    fontSize: 16,
    color: colors.flagship,
    fontWeight: "600",
    marginLeft: 10,
  },
});