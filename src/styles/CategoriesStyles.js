import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  categoriesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 16, // Edge padding
  },
  categoryCardWrapper: {
    marginRight: 15, // Space between cards
    width: 120, // Fixed width for card consistency
  },
  categoryCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15, // Taller card
    paddingHorizontal: 10,
    borderRadius: 15, // Softer corners than pill shape
    backgroundColor: colors.surface, // White base
    borderWidth: 1, // Subtle border
    borderColor: `${colors.textLight}30`, // Light gray border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // Base elevation (animated higher when active)
  },
  iconContainer: {
    padding: 8, // Padding around icon for balance
    borderRadius: 12,
    backgroundColor: colors.background, // Slightly darker background for icon
    marginBottom: 8, // Space between icon and text
  },
  categoryText: {
    fontSize: 14, // Slightly smaller for card layout
    fontWeight: "700", // Bolder text for emphasis
    color: colors.textDark,
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.2,
  },
  categoryTextActive: {
    color: colors.primary,
  },
});