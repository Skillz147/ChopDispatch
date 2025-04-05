import { StyleSheet, Platform } from "react-native";
import colors from "./colors"; // Your exact import

export default StyleSheet.create({
  addAddressContainer: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  addressInput: {
    flex: 1, // Take remaining space
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    minHeight: 40,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.error,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});