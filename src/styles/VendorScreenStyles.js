// src/styles/VendorScreenStyles.js
import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 15,
  },
  contentContainer: {
    paddingBottom: 40, // Extra padding at the bottom for scroll
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.flagship,
    marginLeft: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 15,
    textAlign: "center",
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  icon: {
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1, // Takes up available space before input/options
  },
  input: {
    flex: 2, // Takes more space for input
    fontSize: 16,
    color: colors.textDark,
    paddingVertical: 0, // Remove vertical padding to align with label
  },
  optionContainer: {
    flexDirection: "row",
    flex: 1, // Takes less space than input for options
  },
  optionButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingVertical: 6,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  optionButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textLight,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 18,
    color: colors.surface,
    fontWeight: "600",
  },

  // New Styles for Terms and Conditions
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsText: {
    fontSize: 16,
    color: colors.textDark,
    marginLeft: 10,
    flex: 1,
  },
  termsLink: {
    color: colors.primary,
    textDecorationLine: "underline",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginHorizontal: 15,
    maxHeight: "80%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
  },
  modalBody: {
    padding: 15,
  },
  modalText: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
  },
  modalCloseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    margin: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalCloseButtonText: {
    fontSize: 18,
    color: colors.surface,
    fontWeight: "600",
  },
});