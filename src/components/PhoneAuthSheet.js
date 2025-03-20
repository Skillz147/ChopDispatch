import React, { useState, useRef, useContext, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import * as Location from "expo-location";
import { showToast } from "./ToastMessage";
import { signInWithPhone, auth, db } from "../config/firebaseConfig";
import styles from "../styles/PhoneSheetStyles";
import phoneDemo from "../config/phoneDemo.json";
import { MotiView } from "moti";
import colors from "../styles/colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../context/AuthContext";

const PhoneAuthSheet = ({ visible, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [formattedValue, setFormattedValue] = useState("");
    const [verificationId, setVerificationId] = useState(null);
    const [code, setCode] = useState("");
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const [step, setStep] = useState("phone");
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [addressLine, setAddressLine] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [landmark, setLandmark] = useState("");
    const [customName, setCustomName] = useState("");
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const isExpoGo = Platform.OS === "ios" || Platform.OS === "android";
    const navigation = useNavigation();
    const { setUser } = useContext(AuthContext);

    const resetForm = () => {
        setPhoneNumber("");
        setFormattedValue("");
        setVerificationId(null);
        setCode("");
        setDisplayName("");
        setEmail("");
        setAddressLine("");
        setCity("");
        setState("");
        setLandmark("");
        setCustomName("");
        setIsDemo(false);
        setStep("phone");
    };

    const sendOTP = async () => {
        setLoadingSend(true);
        try {
            // Ensure the phone number starts with a "+" and country code
            const formattedPhone = formattedValue.startsWith("+") ? formattedValue : `+234${formattedValue}`;
            const confirmation = await signInWithPhone(formattedPhone);
            if (confirmation.verificationId === "EXPO_GO_FAKE_VERIFICATION") {
                setIsDemo(true);
                setVerificationId(confirmation.verificationId);
                setCode(confirmation.demoCode);
                showToast("Using demo OTP: " + confirmation.demoCode, "success");
            } else {
                setVerificationId(confirmation.verificationId);
                showToast("OTP Sent Successfully!", "success");
            }
            setStep("otp");
        } catch (error) {
            showToast(error.message, "error");
        }
        setLoadingSend(false);
    };

    const verifyOTP = async () => {
        if (!verificationId || code.length < 6) {
            showToast("Enter a valid OTP", "error");
            return;
        }
        setLoadingVerify(true);
        try {
            let userCredential;
            if (isDemo) {
                userCredential = { user: { uid: "demo-user", phoneNumber: formattedValue } };
                showToast("Demo OTP verified!", "success");
            } else {
                const credential = PhoneAuthProvider.credential(verificationId, code);
                userCredential = await signInWithCredential(auth, credential);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({});
                const reverseGeocode = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                if (reverseGeocode.length > 0) {
                    setCity(reverseGeocode[0].city || "");
                    setState(reverseGeocode[0].region === "FCT" ? "FCT" : `${reverseGeocode[0].region} State`);
                }
            }
            setStep("form");
        } catch (error) {
            showToast(error.message, "error");
        }
        setLoadingVerify(false);
    };

    const submitUserData = async () => {
        if (!displayName || !email || !addressLine || !city || !state) {
            showToast("Please fill in all required fields!", "error");
            return;
        }
        setLoadingSubmit(true);
        try {
            if (!auth.currentUser && !isDemo) {
                showToast("Authentication failed. Please try again.", "error");
                return;
            }

            const user = auth.currentUser || { uid: "demo-user", phoneNumber: formattedValue };
            const userData = {
                uid: user.uid,
                displayName,
                email,
                phone: formattedValue,
                role: "customer",
                createdAt: new Date().toISOString(),
            };
            const addressData = {
                userId: user.uid,
                address: `${addressLine}, ${city}, ${state}`,
                customName: customName || "Home",
                landmark: landmark || "",
                createdAt: new Date().toISOString(),
            };

            if (isDemo || auth.currentUser) {
                await setDoc(doc(db, "users", user.uid), userData);
                await setDoc(doc(db, "addresses", user.uid), addressData);
            } else {
                showToast("User not authenticated. Please verify OTP again.", "error");
                return;
            }

            setUser(userData);
            await AsyncStorage.setItem("user", JSON.stringify(userData));

            showToast("Account created successfully!", "success");
            resetForm();
            onClose();
            navigation.replace("Onboarding");
        } catch (error) {
            showToast(error.message, "error");
        }
        setLoadingSubmit(false);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalBackground}>
                    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                            <View style={styles.authContainer}>
                                <View style={styles.titleContainer}>
                                    <Icon name={step === "form" ? "account" : "phone"} size={28} color={colors.flagship} style={styles.titleIcon} />
                                    <Text style={styles.title}>
                                        {step === "form" ? "Complete Your Profile" : "Phone Sign-In"}
                                    </Text>
                                </View>

                                {step === "phone" && (
                                    <>
                                        <View style={styles.inputContainer}>
                                            <Icon name="phone" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Enter phone number (e.g., 8031234567)"
                                                value={phoneNumber}
                                                onChangeText={(text) => {
                                                    setPhoneNumber(text);
                                                    setFormattedValue(text);
                                                }}
                                                keyboardType="phone-pad"
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <MotiView
                                            from={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ type: "spring", damping: 8 }}
                                        >
                                            <TouchableOpacity style={styles.button} onPress={sendOTP} disabled={loadingSend}>
                                                <View style={styles.buttonContent}>
                                                    {loadingSend ? (
                                                        <ActivityIndicator size="small" color={colors.surface} />
                                                    ) : (
                                                        <>
                                                            <Icon name="message-text-outline" size={20} color={colors.surface} />
                                                            <Text style={styles.buttonText}>Send OTP</Text>
                                                        </>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </MotiView>
                                    </>
                                )}

                                {step === "otp" && (
                                    <>
                                        <View style={styles.inputContainer}>
                                            <Icon name="numeric" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Enter OTP"
                                                value={code}
                                                onChangeText={setCode}
                                                keyboardType="numeric"
                                                maxLength={6}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <MotiView
                                            from={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            transition={{ type: "spring", damping: 8 }}
                                        >
                                            <TouchableOpacity style={styles.button} onPress={verifyOTP} disabled={loadingVerify}>
                                                <View style={styles.buttonContent}>
                                                    {loadingVerify ? (
                                                        <ActivityIndicator size="small" color={colors.surface} />
                                                    ) : (
                                                        <>
                                                            <Icon name="check-circle-outline" size={20} color={colors.surface} />
                                                            <Text style={styles.buttonText}>Verify OTP</Text>
                                                        </>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </MotiView>
                                    </>
                                )}

                                {step === "form" && (
                                    <>
                                        <View style={styles.inputContainer}>
                                            <Icon name="account" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Display Name"
                                                value={displayName}
                                                onChangeText={setDisplayName}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="email" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Email"
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="home" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Street Address"
                                                value={addressLine}
                                                onChangeText={setAddressLine}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="city" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="City"
                                                value={city}
                                                onChangeText={setCity}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="map" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="State"
                                                value={state}
                                                onChangeText={setState}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="map-marker" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Landmark (optional)"
                                                value={landmark}
                                                onChangeText={setLandmark}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <Icon name="label" size={24} color={colors.textDark} style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="Address Name (e.g., Home)"
                                                value={customName}
                                                onChangeText={setCustomName}
                                                style={styles.input}
                                                placeholderTextColor={colors.textLight}
                                            />
                                        </View>
                                        <MotiView
                                            from={{ opacity: 0, translateY: 10 }}
                                            animate={{ opacity: 1, translateY: 0 }}
                                            transition={{ type: "spring", damping: 8 }}
                                        >
                                            <TouchableOpacity style={styles.button} onPress={submitUserData} disabled={loadingSubmit}>
                                                <View style={styles.buttonContent}>
                                                    {loadingSubmit ? (
                                                        <ActivityIndicator size="small" color={colors.surface} />
                                                    ) : (
                                                        <>
                                                            <Icon name="account-check" size={20} color={colors.surface} />
                                                            <Text style={styles.buttonText}>Submit</Text>
                                                        </>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        </MotiView>
                                    </>
                                )}

                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Icon name="close-circle" size={24} color={colors.accent} />
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default PhoneAuthSheet;