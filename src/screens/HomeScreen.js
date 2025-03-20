// src/screens/HomeScreen.js
import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { SignupContext } from "../context/SignupProvider";
import { CartContext } from "../context/CartContext";
import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import RiderPickUpScreen from "./RiderPickUpScreen";
import TrackScreen from "./TrackScreen";
import DeliveryScreen from "./DeliveryScreen";
import CartScreen from "./CartScreen";
import WhatsNewScreen from "./WhatsNewScreen";
import NewsDetailScreen from "./NewsDetailScreen";
import AccountNavigator from "./AccountScreen";
import styles from "../styles/HomeScreenStyles";
import colors from "../styles/colors";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const Header = ({ user, setupChoice, toggleChoice }) => {
  const firstName = user?.displayName?.split(" ")[0] || "there";
  const switchText = setupChoice === "PickUp" ? "Switch To Store" : "Switch To Delivery";

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.greeting}>
        {getGreeting()}, <Text style={styles.highlight}>{firstName}</Text>
      </Text>
      <TouchableOpacity onPress={toggleChoice} style={styles.switchButton}>
        <Text style={styles.switchText}>{switchText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const MainTabs = ({ user, userChoice, toggleChoice, profilePic }) => {
  const { getCartItemCount } = useContext(CartContext);
  const firstName = user?.displayName?.split(" ")[0] || "there";

  return (
    <View style={styles.container}>
      <Header user={user} setupChoice={userChoice} toggleChoice={toggleChoice} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabel: "",
          tabBarActiveTintColor: route.name === "WhatsNew" ? colors.gold : colors.flagship,
          tabBarInactiveTintColor: colors.textLight,
          tabBarIcon: ({ color, focused }) => {
            if (route.name === firstName) {
              return (
                <View style={styles.tabIconContainer}>
                  <Image
                    source={{
                      uri: profilePic || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ",
                    }}
                    style={styles.profileTabIcon}
                  />
                  {focused && (
                    <View
                      style={[
                        styles.activeTabUnderline,
                        { backgroundColor: colors.flagship },
                      ]}
                    />
                  )}
                </View>
              );
            }

            let iconName;
            switch (route.name) {
              case "PickUp":
                iconName = "truck-fast";
                break;
              case "Track":
                iconName = "map-marker-path";
                break;
              case "DeliveryHome":
                iconName = "home";
                break;
              case "Cart":
                iconName = "cart";
                break;
              case "WhatsNew":
                iconName = "fire";
                break;
              default:
                iconName = "circle";
            }
            return (
              <View style={styles.tabIconContainer}>
                <Icon name={iconName} color={color} size={30} />
                {route.name === "Cart" && getCartItemCount() > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{getCartItemCount()}</Text>
                  </View>
                )}
                {focused && (
                  <View
                    style={[
                      styles.activeTabUnderline,
                      { backgroundColor: color },
                    ]}
                  />
                )}
              </View>
            );
          },
        })}
      >
        {userChoice === "PickUp" ? (
          <>
            <Tab.Screen name="PickUp" component={RiderPickUpScreen} />
            <Tab.Screen name="Track" component={TrackScreen} />
          </>
        ) : (
          <>
            <Tab.Screen name="DeliveryHome" component={DeliveryScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="WhatsNew" component={WhatsNewScreen} />
          </>
        )}
        <Tab.Screen name={firstName} component={AccountNavigator} />
      </Tab.Navigator>
    </View>
  );
};

const HomeScreen = () => {
  const { user, loading, setAuthLoading } = useContext(AuthContext); // Access AuthContext loading
  const { userChoice, setUserChoice } = useContext(SignupContext);
  const [profilePic, setProfilePic] = useState("https://example.com/default-icon.png");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!user?.uid) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfilePic(userData.profilePic || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ");
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchProfilePic();
  }, [user]);

  const toggleChoice = async () => {
    setAuthLoading(true); // Show loader from AuthContext
    const newChoice = userChoice === "PickUp" ? "Delivery" : "PickUp";
    try {
      await setUserChoice(newChoice, navigation); // Update user choice
    } catch (error) {
      console.error("Error toggling choice:", error);
    } finally {
      setAuthLoading(false); // Hide loader after update
    }
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {(props) => (
          <MainTabs
            {...props}
            user={user}
            userChoice={userChoice}
            toggleChoice={toggleChoice}
            profilePic={profilePic}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
    </Stack.Navigator>
  );
};

export default HomeScreen;