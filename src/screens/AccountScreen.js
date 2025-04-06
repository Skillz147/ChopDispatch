// src/screens/AccountScreen.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { AccountScreenComponent } from "./AccountScreen/AccountScreenComponent";
import MyProfileScreen from "./MyProfileScreen";
import SettingsScreen from "./SettingsScreen";
import OrdersScreen from "./OrdersScreen";
import NotificationScreen from "./NotificationScreen";
import SecurityScreen from "./SecurityScreen";
import PrivacyScreen from "./PrivacyScreen";
import SupportScreen from "./SupportScreen";
import VendorScreen from "./VendorScreen";
import UserChatScreen from "./UserChatScreen";
import LiveChatScreen from "./LiveChatScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreenComponent} />
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Security" component={SecurityScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Vendor" component={VendorScreen} />
      <Stack.Screen name="UserChatScreen" component={UserChatScreen} />
      <Stack.Screen name="LiveChatScreen" component={LiveChatScreen} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;