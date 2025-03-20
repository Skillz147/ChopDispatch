// src/styles/LiveChatUserStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.surface, // White background
    borderBottomWidth: 1,
    borderColor: colors.textLight, // Softer grey border
  },
  headerRow: {
    flexDirection: "row", // Align status and buttons on the same line
    alignItems: "center",
    justifyContent: "space-between", // Space between status and buttons
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Take available space
  },
  statusText: {
    fontSize: 16,
    color: colors.textDark, // Dark text for contrast
    marginLeft: 8,
    flex: 1,
  },
  liveIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary, // Vibrant green for live
    marginLeft: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    alignItems: "center",
  },
  endChatButton: {
    backgroundColor: colors.accent, // Coral for buttons
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10, // Space between buttons
  },
  endChatText: {
    color: colors.surface, // White text
    fontSize: 14,
    fontWeight: "600",
  },
  clearHistoryButton: {
    backgroundColor: colors.error, // Red for destructive action
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  clearHistoryText: {
    color: colors.surface, // White textendChatButton
    fontSize: 14,
    fontWeight: "600",
  },
});