import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthProvider from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import AppNavigator from "./src/navigation/AppNavigator";
import SignupProvider from "./src/context/SignupProvider";
import Toast, { toastConfig } from "./src/components/ToastMessage";

const linking = {
  prefixes: ["chopdispatch://"],
  config: {
    screens: {
      Welcome: "welcome",
      Onboarding: "onboarding",
      Option: "option",
      Home: "home",
      Delivery: "delivery", // Add DeliveryScreen route
      TrackDetails: "track-details",
      Store: "store/:id",   // Deep link for stores
      Product: "product/:productId/:storeId", // Deep link for products
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SignupProvider>
          <CartProvider>
            <NavigationContainer linking={linking}>
              <AppNavigator />
            </NavigationContainer>
            <Toast config={toastConfig} />
          </CartProvider>
        </SignupProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}