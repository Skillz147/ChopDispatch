// src/screens/AccountScreen/AccountScreenComponent.js
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { AccountHeaderWidget } from "./AccountHeaderWidget";
import { FundingScreenWidget } from "./FundingScreenWidget"; // New import
import useAccountScreenLogic from "./AccountScreenLogic";
import styles from "../../styles/AccountScreenStyles";

export const AccountScreenComponent = () => {
  const navigation = useNavigation();
  const {
    user,
    isLoading,
    isUpdateSheetVisible,
    updateCount,
    forceUpdate,
    isExpoGo,
    isVendorStatusSheetVisible,
    pan,
    widgetSize,
    panResponder,
    setIsUpdateSheetVisible,
    setIsVendorStatusSheetVisible,
    setWidgetSize,
    handleLogout,
    handleCheckForUpdate,
    handleWidgetPress,
  } = useAccountScreenLogic(navigation);

  const createdAt = user?.createdAt || "2025-03-16T01:48:53.601Z";
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - createdDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const membership =
    diffDays < 365
      ? `Member Since: ${createdDate.toLocaleString("default", { month: "long" })} ${createdDate.getFullYear()}`
      : `Member Since: ${createdDate.getFullYear()}`;

  const roleDisplay =
    user?.role === "customer" ? "Account Type: Standard" : user?.role === "vendor" ? "Account Type: Vendor" : "Role not set";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AccountHeaderWidget
          user={user}
          isLoading={isLoading}
          isUpdateSheetVisible={isUpdateSheetVisible}
          setIsUpdateSheetVisible={setIsUpdateSheetVisible}
          forceUpdate={forceUpdate}
          isExpoGo={isExpoGo}
          isVendorStatusSheetVisible={isVendorStatusSheetVisible}
          setIsVendorStatusSheetVisible={setIsVendorStatusSheetVisible}
          membership={membership}
          roleDisplay={roleDisplay}
        />
        <FundingScreenWidget user={user} />
        <View style={styles.contentContainer}>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("MyProfile")}>
            <Icon name="account-circle" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>My Profile</Text>
              <Text style={styles.navDescription}>View and edit your personal information</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Settings")}>
            <Icon name="cog" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Settings</Text>
              <Text style={styles.navDescription}>Customize app preferences and options</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Orders")}>
            <Icon name="package-variant" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Orders</Text>
              <Text style={styles.navDescription}>View your order history and status</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Notifications")}>
            <Icon name="bell" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Notifications</Text>
              <Text style={styles.navDescription}>Manage your notification settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Security")}>
            <Icon name="lock" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Security</Text>
              <Text style={styles.navDescription}>Update your password and security settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Privacy")}>
            <Icon name="shield-lock" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Privacy</Text>
              <Text style={styles.navDescription}>Control your data and privacy settings</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navContainer} onPress={() => navigation.navigate("Support")}>
            <Icon name="headset" size={45} color={styles.navIcon.color} style={styles.navIcon} />
            <View style={styles.navTextContainer}>
              <Text style={styles.navTitle}>Support</Text>
              <Text style={styles.navDescription}>Get help and contact support</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerButton} onPress={handleLogout}>
          <Icon name="logout" size={30} color={styles.footerButtonText.color} />
          <Text style={styles.footerButtonText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={handleCheckForUpdate}>
          <View style={styles.updateIconContainer}>
            <Icon name="update" size={30} color={styles.footerButtonText.color} />
            {updateCount > 0 && <View style={styles.updateBadge}></View>}
          </View>
          <Text style={styles.footerButtonText}>Check for Update</Text>
        </TouchableOpacity>
      </View>

      {user?.role === "customer" && (
        <Animated.View
          style={[
            styles.floatingWidget,
            { transform: pan.getTranslateTransform() },
          ]}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setWidgetSize({ width, height });
          }}
          {...panResponder.panHandlers}
        >
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={handleWidgetPress}
            activeOpacity={0.8}
          >
            <Icon
              name={user?.hasAppliedForVendor ? "information" : "store-plus"}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.floatingButtonText}>
              {user?.hasAppliedForVendor ? "Check Status" : "Upgrade to Vendor"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};