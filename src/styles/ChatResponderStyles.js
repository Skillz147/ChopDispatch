// src/styles/ChatResponderStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  optionsContainer: {
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  optionsContent: {
    paddingHorizontal: 10,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  optionText: {
    color: colors.surface,
    fontSize: 16,
    marginLeft: 8,
  },
  waitingText: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: "center",
    marginBottom: 10,
  },
});