import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  categoryCardWrapper: {
    marginRight: 15,
    width: 120,
  },
  categoryCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.textLight}30`,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: colors.background,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryImage: {
    width: 32, // Adjust size to fit your PNGs
    height: 32,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textDark,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.2,
  },
  categoryTextActive: {
    color: colors.primary,
  },
});