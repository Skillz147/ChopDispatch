import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../styles/UserInfoStyles";
import colors from "../../styles/colors";

const UserInfo = ({ user }) => {
  return (
    <>
      <View style={styles.detailContainer}>
        <Ionicons name="person" size={24} color={colors.primary} style={styles.detailIcon} />
        <Text style={styles.infoLabel}>Name</Text>
        <Text style={styles.infoText}>{user?.displayName || "Not set"}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailContainer}>
        <Ionicons name="mail" size={24} color={colors.primary} style={styles.detailIcon} />
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoText}>{user?.email || "Not set"}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailContainer}>
        <Ionicons name="call" size={24} color={colors.primary} style={styles.detailIcon} />
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={styles.infoText}>{user?.phone || "Not set"}</Text>
      </View>
    </>
  );
};

export default UserInfo;
