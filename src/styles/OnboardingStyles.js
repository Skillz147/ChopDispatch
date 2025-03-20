// src/styles/OnboardingStyles.js
import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors"; // Correct path to colors

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.flagship, // #F5F5F5
  },
  page: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    backgroundColor: colors.flagship,
  },
  lottieContainer: {
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  lottieWrapper: {
    width: "100%",
    height: "100%",
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  title1: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary, // #00A36C
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: colors.surface, // #004D40
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 15,
    color: colors.surface, // #666666
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.surface, // #666666
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  featureItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  featureIcon: {
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.surface, // #FF6F61
  },
  tagline: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary, // #00A36C
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: colors.primary, // #00A36C
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: colors.flagship,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary, // #666666
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: colors.surface, // #00A36C
    width: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default styles;