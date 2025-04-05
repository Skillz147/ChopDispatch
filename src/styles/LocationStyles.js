import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  locationsContainer: {
    paddingHorizontal: 16,
  },
  locationCardWrapper: {
    marginRight: 10,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDark,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  locationTextActive: {
    color: colors.primary,
  },
});