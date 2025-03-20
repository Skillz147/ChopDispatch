// src/components/LiveChatUser.js
import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { realtimeDB } from "../config/firebaseConfig";
import { ref, onValue, off, set } from "firebase/database";
import styles from "../styles/LiveChatUserStyles";
import colors from "../styles/colors";

const LiveChatUser = ({ messages, onEndChat, isLiveChatScreen, showAdminStatus = false }) => {
  const { user } = useContext(AuthContext);
  const [adminStatus, setAdminStatus] = useState({ isActive: false, name: null });

  useEffect(() => {
    if (!user) return;

    const adminRef = ref(realtimeDB, `liveChats/${user.uid}/adminPresence`);

    const adminListener = onValue(adminRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.isActive) {
        setAdminStatus({ isActive: true, name: data.name || "Admin" });
      } else {
        setAdminStatus({ isActive: false, name: null });
      }
    });

    return () => off(adminRef, "value", adminListener);
  }, [user]);

  const handleEndChat = () => {
    if (!user || !messages || messages.length === 0) {
      onEndChat();
      return;
    }

    Alert.alert(
      "End Chat",
      "Are you sure you want to end this chat session? It will be saved to your chat history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Chat",
          style: "destructive",
          onPress: () => {
            onEndChat();
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    if (!user) return;

    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to clear all your chat history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear History",
          style: "destructive",
          onPress: async () => {
            const historyRef = ref(realtimeDB, `chatHistory/${user.uid}`);
            await set(historyRef, null);
            Alert.alert("Success", "Your chat history has been cleared.");
          },
        },
      ]
    );
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        {isLiveChatScreen ? (
          <>
            <TouchableOpacity style={styles.endChatButton} onPress={handleEndChat}>
              <Text style={styles.endChatText}>End Chat</Text>
            </TouchableOpacity>
            <View style={styles.statusRow}>
              <Icon
                name={adminStatus.isActive ? "account-check" : "account-cancel"}
                size={24}
                color={adminStatus.isActive ? colors.primary : colors.textLight}
              />
              <Text style={styles.statusText}>
                {adminStatus.isActive ? `${adminStatus.name} active` : "No admin active"}
              </Text>
              {adminStatus.isActive && <View style={styles.liveIndicator} />}
            </View>
          </>
        ) : (
          <>
            {showAdminStatus && (
              <View style={styles.statusRow}>
                <Icon
                  name={adminStatus.isActive ? "account-check" : "account-cancel"}
                  size={24}
                  color={adminStatus.isActive ? colors.primary : colors.textLight}
                />
                <Text style={styles.statusText}>
                  {adminStatus.isActive ? `${adminStatus.name} active` : "No admin active"}
                </Text>
                {adminStatus.isActive && <View style={styles.liveIndicator} />}
              </View>
            )}
            <TouchableOpacity style={styles.clearHistoryButton} onPress={handleClearHistory}>
              <Text style={styles.clearHistoryText}>Clear Chat History</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default LiveChatUser;