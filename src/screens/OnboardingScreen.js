// src/screens/OnboardingScreen.js
import React, { useContext, useState, useRef, useEffect, Component } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SignupContext } from "../context/SignupProvider";
import { AuthContext } from "../context/AuthContext";
import LottieView from "lottie-react-native";
import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons"; // For icons
import styles from "../styles/OnboardingStyles";
import colors from "../styles/colors"; // Correct import for colors

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, color: "red", marginBottom: 10 }}>
            Something went wrong!
          </Text>
          <Text style={{ fontSize: 16, color: "#333" }}>
            {this.state.error?.message || "Unknown error"}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const onboardingData = [
  {
    title1: "Welcome to Delivero",
    title: "Enjoy Our Fast & Reliable Rides",
    subtitle: "Shop with ease and confidence",
    text: "Experience quick, safe, and affordable deliveries with our trusted drivers. Whether you're shopping or sending out  pakcages, we've got you covered.",
    features: [
      { name: "Safe", icon: "security" },
      { name: "Fast", icon: "speed" },
      { name: "Affordable", icon: "attach-money" },
    ],
    lottie: require("../../assets/lottie/welcome.json"),
  },
  {
    title: "Quick Package Delivery",
    subtitle: "Send and receive with ease",
    text: "Need to send a package? Our efficient delivery service ensures your items reach their destination on time. From documents to gifts, we handle it all.",
    features: [
      { name: "Documents", icon: "description" },
      { name: "Groceries", icon: "shopping-cart" },
      { name: "Gifts", icon: "card-giftcard" },
    ],
    lottie: require("../../assets/lottie/dunno.json"),
  },
  {
    title: "24/7 Customer Support",
    subtitle: "We’re here for you anytime",
    text: "Our dedicated support team is available round-the-clock to assist you. Reach out via chat, call, or email—we’re just a tap away!",
    features: [
      { name: "Chat", icon: "chat" },
      { name: "Call", icon: "phone" },
      { name: "Email", icon: "email" },
    ],
    tagline: "Your satisfaction is our priority!",
    lottie: require("../../assets/lottie/support.json"),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { completeOnboarding } = useContext(SignupContext);
  const { user } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef(null);

  // Animation for Lottie bounce
  const lottieScale = useSharedValue(0);
  useEffect(() => {
    lottieScale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, [currentPage]);

  const lottieStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lottieScale.value }],
  }));

  const handleDone = async () => {
    try {
      console.log("OnboardingScreen: handleDone started, user:", user?.uid);
      if (!user?.uid) throw new Error("No user ID available");
      await completeOnboarding(user.uid, navigation);
      console.log("OnboardingScreen: handleDone completed");
    } catch (error) {
      console.error("OnboardingScreen: Error in handleDone:", error.message);
      navigation.replace("Welcome");
    }
  };

  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log("OnboardingScreen: onViewableItemsChanged, viewableItems:", viewableItems);
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  console.log("OnboardingScreen: Rendering, user:", user?.uid);

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item, index }) => {
            console.log("OnboardingScreen: Rendering item at index:", index);
            return (
              <View style={styles.page}>
                {item.title1 && (
                  <Animated.Text
                    entering={FadeInDown.duration(800).delay(200)}
                    style={styles.title1}
                  >
                    {item.title1}
                  </Animated.Text>
                )}
                <Animated.Text
                  entering={FadeInDown.duration(800).delay(400)}
                  style={styles.title}
                >
                  {item.title}
                </Animated.Text>
                {item.subtitle && (
                  <Animated.Text
                    entering={FadeInDown.duration(800).delay(500)}
                    style={styles.subtitle}
                  >
                    {item.subtitle}
                  </Animated.Text>
                )}
                <Animated.View entering={FadeInDown.duration(800).delay(600)} style={styles.lottieContainer}>
                  <Animated.View style={[styles.lottieWrapper, lottieStyle]}>
                    <LottieView
                      source={item.lottie}
                      autoPlay
                      loop
                      style={styles.lottie}
                      resizeMode="contain"
                      onError={(error) => console.error("Lottie Error:", error)}
                    />
                  </Animated.View>
                </Animated.View>
                <Animated.Text
                  entering={FadeInDown.duration(800).delay(800)}
                  style={styles.text}
                >
                  {item.text}
                </Animated.Text>
                <Animated.View entering={FadeInDown.duration(800).delay(900)} style={styles.featuresContainer}>
                  {item.features.map((feature, i) => (
                    <Animated.View
                      key={i}
                      entering={FadeInDown.duration(800).delay(1000 + i * 200)}
                      style={styles.featureItem}
                    >
                      <Icon name={feature.icon} size={30} color={colors.surface} style={styles.featureIcon} />
                      <Text style={styles.featureText}>{feature.name}</Text>
                    </Animated.View>
                  ))}
                </Animated.View>
                {item.tagline && (
                  <Animated.Text
                    entering={FadeInDown.duration(800).delay(1200)}
                    style={styles.tagline}
                  >
                    {item.tagline}
                  </Animated.Text>
                )}
                {index === onboardingData.length - 1 && (
                  <Animated.View entering={FadeInDown.duration(800).delay(1400)}>
                    <TouchableOpacity onPress={handleDone}>
                      <View style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </View>
            );
          }}
        />

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentPage === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      </View>
    </ErrorBoundary>
  );
};

export default OnboardingScreen;