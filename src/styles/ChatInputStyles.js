// src/styles/ChatInputStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: colors.textLight, // Softer grey border
    backgroundColor: colors.background, // Light grey background
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textLight, // Softer grey border
    borderRadius: 25,
    padding: 12,
    marginRight: 12,
    backgroundColor: colors.surface, // White input background
    fontSize: 16,
    color: colors.textDark, // Dark text for contrast
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: colors.primary, // Vibrant green button
    borderRadius: 10,
    width: 60, // Fixed width for icon
    height: 44, // Fixed height for icon
  },
});