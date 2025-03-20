import { StyleSheet } from "react-native";
import colors from "../styles/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    marginBottom: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: colors.surface,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: `${colors.textLight}20`,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  optionContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: colors.textDark,
  },
  bankSelectionText: {
    fontSize: 14,
    color: colors.textLight,
  },
  icon: {
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
  },
  bankModalContainer: {
    backgroundColor: colors.surface,
    borderRadius: 15,
    margin: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
  },
  bankList: {
    padding: 10,
  },
  bankItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}20`,
  },
  bankText: {
    fontSize: 16,
    color: colors.textDark,
  },
  loader: {
    marginVertical: 20,
  },
});