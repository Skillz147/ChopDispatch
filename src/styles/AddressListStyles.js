import { StyleSheet, Platform } from "react-native";
import colors from "./colors"; // Your exact import from earlier

export default StyleSheet.create({
  addressSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textDark,
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
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Take remaining space
  },
  addressIcon: {
    marginRight: 10,
  },
  addressText: {
    fontSize: 14,
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    flex: 1, // Allow text to wrap
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: "row", // Align icon and text
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addIcon: {
    marginRight: 8,
  },
  addButtonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});