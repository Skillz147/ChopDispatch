import { StyleSheet, Dimensions } from "react-native";
import colors from "../styles/colors";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    maxHeight: "90%",
  },
  confirmationOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  closeButton: {
    alignSelf: "flex-start",
    padding: 10,
  },
  closeText: {
    fontSize: 16,
    color: colors.primary,
  },
  contentContainer: {
    flexGrow: 1, // Allow content to grow and scroll within CheckOutForm's FlatList
  },
  orderSummary: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.flagship,
    marginBottom: 10,
  },
  summaryContent: {
    // Removed ScrollView, now a static View
  },
  summaryItem: {
    marginBottom: 10,
    padding: 5,
  },
  summaryItemName: {
    fontSize: 14,
    color: colors.textDark,
  },
  summarySubItem: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 10,
  },
  summaryItemTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.textLight,
    padding: 10,
    alignItems: "center",
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 10,
  },
  feeBreakdown: {
    fontSize: 12,
    color: colors.textLight,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    width: "80%",
  },
  nextButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
  },
});