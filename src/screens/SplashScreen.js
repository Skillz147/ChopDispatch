import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Loader from "../components/Loader"; // Import the Loader component

const SplashScreen = () => {
    const { user, loading } = useContext(AuthContext);
    const navigation = useNavigation();
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);

    useEffect(() => {
        const checkOnboarding = async () => {
            const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
            
            if (!loading) {
                if (!user) {
                    navigation.replace("Welcome");
                } else if (!hasSeenOnboarding) {
                    navigation.replace("Onboarding");
                } else {
                    navigation.replace("Home");
                }
            }

            setCheckingOnboarding(false);
        };

        checkOnboarding();
    }, [user, loading]);

    if (loading || checkingOnboarding) {
        return <Loader />; // Use the Lottie-based Loader from AuthContext
    }

    return null;
};

export default SplashScreen;