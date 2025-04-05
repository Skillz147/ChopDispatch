import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors"; // Your exact import

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  profilePicContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    resizeMode: "contain",
  },
  pencilIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderRadius: 15,
    padding: 5,
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject, // Cover the image
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    borderRadius: 10,
  },
  optionsContainer: {
    position: "absolute",
    top: "0%",
    left: 0,
    zIndex: 20,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  optionText: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  expandedProfilePic: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
});