import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}20`,
  },
  categoriesSection: {
    marginTop: 10,
  },
  locationsSection: {
    marginTop: 10,
  },
  adsSection: {
    marginTop: 10,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  subHeaderText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  storesSection: {
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loaderAnimation: {
    width: 100,
    height: 100,
  },
  loaderText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error || "#FF0000",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.surface,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  noStoresContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  noStoresAnimation: {
    width: 150,
    height: 150,
  },
  noStoresText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
});