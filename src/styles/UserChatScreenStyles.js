// src/styles/UserChatScreenStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  historyView: {
    flex: 1,
    padding: 10,
  },
  historyContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 8,
    padding: 10,
  },
  historyHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 5,
  },
  lastMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessageText: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
  },
  lastMessageTimestamp: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 10,
  },
  noMessageText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: "italic",
  },
  historyList: {
    flex: 1,
  },
  noHistoryText: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 20,
  },
  startChatButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  startChatText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  continueChatContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 8,
    padding: 10,
  },
  continueChatText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 5,
  },
  continueChatButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  continueChatButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 16,
    color: colors.textDark,
  },
});