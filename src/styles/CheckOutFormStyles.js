import { StyleSheet } from "react-native";
import colors from "../styles/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: {
    width: 150,
    height: 150,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.background,
    color: colors.textDark,
  },
  icon: {
    marginRight: 10,
  },
  saveToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saveText: {
    fontSize: 16,
    color: colors.textDark,
  },
  addressList: {
    marginBottom: 15,
  },
  addressItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Add spacing between address items
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: `${colors.textLight}20`,
    flex: 1, // Take full width
  },
  addressItemSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  addressDetails: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 5,
  },
  addressSubText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 3,
    lineHeight: 16,
  },
  addNewButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.lightGray,
    borderRadius: 5,
  },
  addNewText: {
    color: colors.primary,
    marginLeft: 5,
    fontSize: 16,
  },
  editButton: {
    padding: 5,
    marginLeft: 10, // Space between address item and edit button
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
});