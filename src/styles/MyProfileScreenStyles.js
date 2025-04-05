import { StyleSheet, Platform } from "react-native";
import colors from "./colors"; // Your exact import

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${colors.textLight}20`,
    // Removed overflow: "hidden" to prevent clipping
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: `${colors.primary}10`,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}30`,
  },
  headerIcon: {
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});