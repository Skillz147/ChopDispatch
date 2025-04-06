// src/screens/AccountScreen/AccountHeaderWidget.js
import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import UpdateSheet from "../../components/UpdateSheet";
import VendorStatusSheet from "../../components/VendorStatusSheet";
import styles from "../../styles/AccountHeaderWidgetStyles";
import colors from "../../styles/colors";

export const AccountHeaderWidget = ({
  user,
  isLoading,
  isUpdateSheetVisible,
  setIsUpdateSheetVisible,
  forceUpdate,
  isExpoGo,
  isVendorStatusSheetVisible,
  setIsVendorStatusSheetVisible,
  membership,
  roleDisplay,
}) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <>
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
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.cardContainer}>
          <View style={styles.userInfoContainer}>
            <View style={styles.userNameContainer}>
              <Ionicons
                name="person-circle-outline"
                size={40}
                color={colors.primary}
                style={styles.profileIcon}
              />
              <Text style={styles.userName}>{user?.displayName || "Guest"}</Text>
              {user?.role === "vendor" && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={colors.success}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="card-outline"
                size={20}
                color={colors.textDark}
                style={styles.detailIcon}
              />
              <Text style={styles.roleText}>{membership || "N/A"}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons
                name="shield-outline"
                size={20}
                color={colors.textDark}
                style={styles.detailIcon}
              />
              <Text style={styles.roleText}>{roleDisplay || "User"}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};