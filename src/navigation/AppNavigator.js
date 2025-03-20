import React, { useContext, useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import { SignupContext } from "../context/SignupProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import OptionScreen from "../screens/OptionScreen";
import HomeScreen from "../screens/HomeScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import TrackDetailsScreen from "../screens/TrackDetailsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);
  const { userChoice } = useContext(SignupContext);
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [initialChoice, setInitialChoice] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const seen = await AsyncStorage.getItem("hasSeenOnboarding");
        const pending = await AsyncStorage.getItem("pendingUser");
        const storedChoice = await AsyncStorage.getItem("userChoice");
        setHasSeenOnboarding(seen === "true");
        setPendingUser(pending);
        setInitialChoice(storedChoice);
        setTimeout(() => setShowSplash(false), 2000);
      } catch (error) {
        console.error("Error initializing app:", error);
        setShowSplash(false);
      }
    };
    initializeApp();
  }, []);

  if (loading || showSplash || hasSeenOnboarding === null) {
    return <SplashScreen />;
  }

  const getInitialRoute = () => {
    if (user && hasSeenOnboarding && (userChoice || initialChoice)) {
      return "Home"; // Auth'd, onboarded, and has a choice -> HomeScreen
    }
    if (user && hasSeenOnboarding) {
      return "Option"; // Auth'd and onboarded, no choice yet -> OptionScreen
    }
    if (pendingUser && !hasSeenOnboarding) {
      return "Onboarding"; // Signed up but not onboarded -> OnboardingScreen
    }
    return "Welcome"; // Unauth or no pending user -> WelcomeScreen
  };

  return (
    <Stack.Navigator initialRouteName={getInitialRoute()} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Option" component={OptionScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="TrackDetails" component={TrackDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;