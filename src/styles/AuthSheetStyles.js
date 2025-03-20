// src/styles/AuthSheetStyles.js
import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  authContainer: {
    backgroundColor: colors.background, // #F5F5F5
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.flagship, // #004D40
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight, // #777
    textAlign: "center",
    marginBottom: 20,
  },
  phoneButton: {
    backgroundColor: colors.flagship, // #004D40
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  phoneButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.textLight, // #777
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
    resizeMode: "contain",
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textDark, // #333
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textLight, // #777
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: colors.textLight, // #777
  },
  emailButton: {
    backgroundColor: colors.flagship, // #004D40
    paddingVertical: 12,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});