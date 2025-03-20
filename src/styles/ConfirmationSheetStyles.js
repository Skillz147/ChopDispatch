import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors"; // Adjust path as needed

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    width: width * 0.85,
    maxHeight: "80%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 5,
  },
  logoTagline: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.flagship,
    marginBottom: 15,
    textAlign: "center",
  },
  body: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  animation: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    width: "100%",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textDark,
    textAlign: "left",
    flex: 1,
  },
  closeButton: {
    backgroundColor: colors.flagship,
    paddingVertical: 12,
    borderRadius: 25,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    marginRight: 8,
  },
  closeButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "600",
  },
});