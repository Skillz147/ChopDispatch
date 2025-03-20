// src/styles/SignupSheetStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors"; // Ensure this matches your color scheme file path

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginTop: 150,
  },
  authContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: "100%",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#004D40",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  termsContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  termsText: {
    fontSize: 12,
    color: "#555",
  },
  termsLink: {
    color: "#0066cc",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "red",
  },
  loadingAnimation: {
    width: 40,
    height: 40,
  },
  confirmationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Darker overlay for contrast
    justifyContent: "center",
    alignItems: "center",
  },
  confirmationBox: {
    backgroundColor: colors.surface, // #FFFFFF
    padding: 25,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.flagship, // #004D40 for a branded border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark, // #1A1A1A
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  detailsContainer: {
    width: "100%",
    marginBottom: 25,
    backgroundColor: colors.background, // #F5F5F5 for a subtle background
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.flagship, // #004D40
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.surface, // #FFFFFF
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textLight, // #666666 for a subtle border
  },
  detailIcon: {
    marginRight: 15,
  },
  detailText: {
    fontSize: 16,
    color: colors.textDark, // #1A1A1A
    fontWeight: "500",
    flex: 1,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: colors.primary, // #00A36C
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  declineButton: {
    backgroundColor: colors.accent, // #FF6F61
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  declineButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});