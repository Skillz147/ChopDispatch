// src/screens/AccountScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import UpdateSheet from "../components/UpdateSheet";
import VendorStatusSheet from "../components/VendorStatusSheet";
import MyProfileScreen from "./MyProfileScreen";
import SettingsScreen from "./SettingsScreen";
import OrdersScreen from "./OrdersScreen";
import NotificationScreen from "./NotificationScreen";
import SecurityScreen from "./SecurityScreen";
import PrivacyScreen from "./PrivacyScreen";
import SupportScreen from "./SupportScreen";
import VendorScreen from "./VendorScreen";
import UserChatScreen from "./UserChatScreen"; // Add this import
import LiveChatScreen from "./LiveChatScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import styles from "../styles/AccountScreenStyles";

const Stack = createStackNavigator();

const UPDATE_CHECK_KEY = "@lastUpdateCheck";
const UPDATE_COUNT_KEY = "@updateCount";
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const AccountScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateSheetVisible, setIsUpdateSheetVisible] = useState(false);
  const [updateCount, setUpdateCount] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [isExpoGo, setIsExpoGo] = useState(false);
  const [isVendorStatusSheetVisible, setIsVendorStatusSheetVisible] = useState(false);

  const pan = useState(new Animated.ValueXY({ x: 0, y: 0 }))[0];
  const [widgetSize, setWidgetSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const detectExpoGo = () => {
      try {
        const appOwnership = Constants.appOwnership;
        const isExpoGoDetected = appOwnership === "expo";
        setIsExpoGo(isExpoGoDetected);
      } catch (error) {
        console.error("Error detecting Expo Go:", error);
        setIsExpoGo(false);
      }
    };

    const checkLastUpdate = async () => {
      const lastCheck = await AsyncStorage.getItem(UPDATE_CHECK_KEY);
      const storedCount = await AsyncStorage.getItem(UPDATE_COUNT_KEY);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setUpdateCount(count);

      const now = new Date().getTime();
      const lastCheckTime = lastCheck ? parseInt(lastCheck, 10) : 0;
      const shouldForceUpdate = count > 0 && now - lastCheckTime > THREE_DAYS_MS;

      setForceUpdate(shouldForceUpdate);
      if (shouldForceUpdate) {
        setIsUpdateSheetVisible(true);
      }
    };

    detectExpoGo();
    checkLastUpdate();
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      pan.setOffset({ x: pan.x._value, y: pan.y._value });
    },
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      const x = Math.max(0, Math.min(pan.x._value, SCREEN_WIDTH - widgetSize.width));
      const y = Math.max(0, Math.min(pan.y._value, SCREEN_HEIGHT - widgetSize.height - 50));
      pan.setValue({ x, y });
      pan.flattenOffset();
    },
  });

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
            } finally {
              setIsLoading(false);
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleCheckForUpdate = () => {
    setIsUpdateSheetVisible(true);
  };

  const handleWidgetPress = () => {
    if (user?.hasAppliedForVendor) {
      setIsVendorStatusSheetVisible(true);
    } else {
      navigation.navigate("Vendor");
    }
  };

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
      {isLoading && <Loader />}
      <UpdateSheet
        visible={isUpdateSheetVisible}
        onClose={() => setIsUpdateSheetVisible(false)}
        forceUpdate={forceUpdate}
        isExpoGo={isExpoGo}
      />
      <VendorStatusSheet
        visible={isVendorStatusSheetVisible}
        onClose={() => setIsVendorStatusSheetVisible(false)}
        userId={user?.uid}
      />
      <View style={styles.headerContainer}>
        <View style={styles.userInfoContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{user?.displayName || "Guest"}</Text>
            {user?.role === "vendor" && (
              <Icon name="check-circle" size={20} color="#1E90FF" style={styles.verifiedIcon} />
            )}
          </View>
          <Text style={styles.roleText}>{membership}</Text>
          <Text style={styles.roleText}>{roleDisplay}</Text>
        </View>
      </View>
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

const AccountNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Account" component={AccountScreen} />
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