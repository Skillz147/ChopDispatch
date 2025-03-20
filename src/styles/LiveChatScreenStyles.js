// src/styles/LiveChatScreenStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderColor: colors.textLight,
  },
  backButton: {
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    maxWidth: "75%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.textLight,
  },
  messageText: {
    color: colors.surface,
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  messageUser: {
    color: colors.surface,
    fontSize: 12,
  },
  messageTimestamp: {
    color: colors.surface,
    fontSize: 12,
    opacity: 0.8,
  },
  errorText: {
    fontSize: 16,
    color: colors.textDark,
  },
});