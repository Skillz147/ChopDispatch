// src/screens/OptionScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { SignupContext } from "../context/SignupProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Location from "expo-location";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles/WelcomeScreenStyles";
import colors from "../styles/colors";
import { OPENWEATHERMAP_API_KEY } from "@env";

// Time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
};

// Weather icon mapping
const weatherIcons = {
  Clear: "weather-sunny",
  Clouds: "weather-cloudy",
  Rain: "weather-rainy",
  Snow: "weather-snowy",
  Thunderstorm: "weather-lightning",
  default: "weather-partly-cloudy",
};

// Rotating tips
const tips = [
  "Tip: Schedule pickups in advance to save time!",
  "Did you know? Our riders are trained for speedy deliveries.",
  "Stay hydrated while we handle your errands!",
];

const OptionScreen = () => {
  const { user } = useContext(AuthContext);
  const { setUserChoice } = useContext(SignupContext);
  const [weather, setWeather] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const navigation = useNavigation();

  const buttonScale1 = useSharedValue(1);
  const buttonScale2 = useSharedValue(1);

  // Debug: Log context once at render
  useEffect(() => {
    console.log("SignupContext in OptionScreen:", { setUserChoice });
  }, [setUserChoice]); // Depend on setUserChoice to log changes

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission Required",
            "Please enable location services to get weather updates.",
            [{ text: "OK" }]
          );
          setWeather({ condition: "Unknown", temp: "N/A", icon: "weather-cloudy" });
          setWeatherLoading(false);
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`
        );
        const data = response.data;
        setWeather({
          condition: data.weather[0].main,
          temp: `${Math.round(data.main.temp)}°C`,
          icon: weatherIcons[data.weather[0].main] || weatherIcons["default"],
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
        setWeather({ condition: "Error", temp: "N/A", icon: "weather-cloudy" });
      } finally {
        setWeatherLoading(false);
      }
    };
    if (user) fetchWeather();
  }, [user]);

  // Fetch recent activity
  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const activity = await AsyncStorage.getItem("lastActivity");
        setRecentActivity(activity || "No recent activity yet");
      } catch (error) {
        console.error("Error fetching recent activity:", error);
        setRecentActivity("Error loading activity");
      }
    };
    if (user) fetchRecentActivity();
  }, [user]);

  const firstName = user?.displayName?.split(" ")[0] || "there";
  const greeting = getGreeting();

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale1.value }],
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale2.value }],
  }));

  const handlePressIn = (scaleValue) => {
    scaleValue.value = withSpring(0.95);
  };
  const handlePressOut = (scaleValue) => {
    scaleValue.value = withSpring(1);
  };

  const handleSelection = async (choice) => {
    try {
      await AsyncStorage.setItem("lastActivity", `${choice} on ${new Date().toLocaleDateString()}`);
      if (!setUserChoice) {
        throw new Error("setUserChoice is not available in SignupContext");
      }
      await setUserChoice(choice, navigation);
    } catch (error) {
      console.error("Error saving activity:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.authScrollContainer}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            {greeting}, <Text style={styles.highlight}>{firstName}</Text>!
          </Text>
          <View style={styles.weatherContainer}>
            {weatherLoading ? (
              <ActivityIndicator size="small" color={colors.light} />
            ) : (
              <>
                <Icon name={weather?.icon} size={24} color={colors.surface} />
                <Text style={styles.weatherText}>
                  {weather?.condition}, {weather?.temp}
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <Text style={styles.cardText}>{recentActivity || "Loading..."}</Text>
          </View>
          <Text style={styles.subText}>How can we help you today?</Text>
          <View style={styles.optionsContainer}>
            <Animated.View style={animatedStyle1}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelection("PickUp")}
                onPressIn={() => handlePressIn(buttonScale1)}
                onPressOut={() => handlePressOut(buttonScale1)}
              >
                <Icon name="truck-fast" size={60} color={colors.primary} />
                <Text style={styles.optionText}>Package Pick Up</Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={animatedStyle2}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={() => handleSelection("Delivery")}
                onPressIn={() => handlePressIn(buttonScale2)}
                onPressOut={() => handlePressOut(buttonScale2)}
              >
                <Icon name="package-variant-closed" size={60} color={colors.primary} />
                <Text style={styles.optionText}>Personal Shopper</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={styles.tipCard}>
            <Icon name="lightbulb-on-outline" size={25} color={colors.flagship} />
            <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OptionScreen;