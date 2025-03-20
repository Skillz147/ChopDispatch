import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native"; // Import Lottie

const Loader = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
            source={require("../../assets/lottie/loader.json")} // Path to your Lottie file
            autoPlay
            loop
            style={{ width: 450, height: 450 }} // Adjust size as needed
        />
    </View>
);

export default Loader;