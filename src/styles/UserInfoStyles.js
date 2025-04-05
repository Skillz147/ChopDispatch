import { StyleSheet, Platform } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  detailIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    marginRight: 10,
    width: 50,
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: `${colors.textLight}30`,
    marginVertical: 8,
  },
});
