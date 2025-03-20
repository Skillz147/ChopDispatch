import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textDark,
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
    paddingBottom: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textDark,
  },
  sectionContent: {
    paddingVertical: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: colors.textDark,
    borderWidth: 1,
    borderColor: colors.textLight,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  formButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: colors.textLight,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: colors.textLight,
  },
  faqCategoryContainer: {
    marginBottom: 15,
  },
  faqCategoryTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textDark,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
    paddingBottom: 5,
  },
  faqItemsContainer: {
    paddingLeft: 10,
  },
  faqItemContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    paddingBottom: 5,
  },
  faqQuestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  faqQuestionText: {
    fontSize: 16,
    color: colors.textDark,
    flex: 1,
    marginRight: 10,
  },
  faqAnswerContainer: {
    paddingLeft: 10,
    paddingTop: 5,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textLight,
  },
  contactItemsContainer: {
    marginBottom: 15,
  },
  contactItemContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  contactTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textDark,
  },
  contactValue: {
    fontSize: 16,
    color: colors.textDark,
    marginTop: 2,
  },
  contactDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  additionalInfoContainer: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.textLight,
  },
  additionalInfoItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  additionalInfoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textDark,
    marginBottom: 2,
  },
  additionalInfoText: {
    fontSize: 14,
    color: colors.textLight,
  },
});