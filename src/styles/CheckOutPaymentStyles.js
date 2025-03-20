// src/styles/CheckOutPaymentStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: colors.textDark,
  },
  icon: {
    marginRight: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  agreeText: {
    fontSize: 14,
    color: colors.textDark,
  },
  linkText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  payButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  payButtonDisabled: {
    backgroundColor: `${colors.primary}50`,
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
  },
  processingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  processingText: {
    fontSize: 16,
    color: colors.textDark,
    marginTop: 10,
  },
  // Modal-specific styles
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  paymentModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: colors.textDark,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 15,
  },
  highlight: {
    color: colors.primary,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  sheetAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textDark,
    marginLeft: 10,
  },
  paymentInfo: {
    fontSize: 14,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 20,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
  },
  cancelText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 5,
  },
});