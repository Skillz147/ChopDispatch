// src/styles/MyProfileScreenStyles.js
import { StyleSheet, Platform } from "react-native";
import colors from "./colors"; // Adjust path as needed

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
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
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pencilIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 5,
  },
  optionsContainer: {
    position: "absolute",
    top: 140,
    zIndex: 10,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  optionButton: {
    paddingVertical: 5,
  },
  optionText: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker background for better contrast
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  expandedProfilePic: {
    width: 300,
    height: 300,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: `${colors.background}80`,
    borderRadius: 8,
  },
  detailIcon: {
    marginRight: 10, // Space between icon and label
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginRight: 8, // Space between label and text
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    flex: 1, // Allow text to take remaining space
  },
  addressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.flagship,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  addressText: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: colors.accent,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
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
  },
  addressInput: {
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10, // Space between buttons
  },
  addButton: {
    backgroundColor: colors.flagship, // Use flagship color for consistency
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1, // Equal width for both buttons
  },
  cancelButton: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flex: 1, // Equal width for both buttons
  },
  buttonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});