// src/screens/UserChatScreen.js
import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";
import { realtimeDB } from "../config/firebaseConfig";
import { ref, onValue, set } from "firebase/database";
import LiveChatUser from "../components/LiveChatUser"; // Add this import
import styles from "../styles/UserChatScreenStyles";
import colors from "../styles/colors";

const UserChatScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [chatHistory, setChatHistory] = useState([]);
  const [ongoingChat, setOngoingChat] = useState([]);
  const [isAdminEnded, setIsAdminEnded] = useState(false);

  useEffect(() => {
    if (!user) return;

    const adminEndedRef = ref(realtimeDB, `liveChats/${user.uid}/adminEnded`);
    const adminEndedListener = onValue(adminEndedRef, (snapshot) => {
      const data = snapshot.val();
      setIsAdminEnded(data === true);
    });

    const historyRef = ref(realtimeDB, `chatHistory/${user.uid}`);
    const historyListener = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const historyArray = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            messages: value.messages || [],
            endedAt: value.endedAt,
            endedBy: value.endedBy,
            lastMessage:
              value.messages && value.messages.length > 0
                ? value.messages.sort((a, b) => b.timestamp - a.timestamp)[0]
                : null,
          }))
          .sort((a, b) => b.endedAt - a.endedAt);

        if (historyArray.length > 10) {
          const oldestChats = historyArray.slice(10);
          oldestChats.forEach(async (chat) => {
            const chatRef = ref(realtimeDB, `chatHistory/${user.uid}/${chat.id}`);
            await set(chatRef, null);
          });
        }

        setChatHistory(historyArray.slice(0, 10));
      } else {
        setChatHistory([]);
      }
    });

    const chatRef = ref(realtimeDB, `liveChats/${user.uid}/messages`);
    const chatListener = onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const fetchedMessages = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            text: value.text,
            timestamp: value.timestamp,
            userId: value.user._id,
            userName: value.user.name,
          }))
          .sort((a, b) => b.timestamp - a.timestamp);
        setOngoingChat(fetchedMessages);
      } else {
        setOngoingChat([]);
      }
    });

    return () => {
      historyListener();
      chatListener();
      adminEndedListener();
    };
  }, [user]);

  const startNewChat = () => {
    navigation.navigate("LiveChatScreen", { startNew: true });
  };

  const continueChat = () => {
    navigation.navigate("LiveChatScreen", { startNew: false });
  };

  const renderHistoryItem = ({ item }) => {
    const endedAt = item.endedAt ? new Date(item.endedAt).toLocaleString() : "Unknown time";
    return (
      <TouchableOpacity style={styles.historyContainer}>
        <Text style={styles.historyHeader}>
          Chat ended on {endedAt} by {item.endedBy}
        </Text>
        {item.lastMessage ? (
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessageText}>
              {item.lastMessage.text.length > 50
                ? `${item.lastMessage.text.substring(0, 50)}...`
                : item.lastMessage.text}
            </Text>
            <Text style={styles.lastMessageTimestamp}>
              {new Date(item.lastMessage.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ) : (
          <Text style={styles.noMessageText}>No messages in this chat.</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Please log in to access live chat.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LiveChatUser isLiveChatScreen={false} showAdminStatus={true} />
      <View style={styles.historyView}>
        {ongoingChat.length > 0 && !isAdminEnded ? (
          <View style={styles.continueChatContainer}>
            <Text style={styles.continueChatText}>Ongoing Chat:</Text>
            <TouchableOpacity style={styles.lastMessageContainer} onPress={continueChat}>
              <Text style={styles.lastMessageText}>
                {ongoingChat[0].text.length > 50
                  ? `${ongoingChat[0].text.substring(0, 50)}...`
                  : ongoingChat[0].text}
              </Text>
              <Text style={styles.lastMessageTimestamp}>
                {new Date(ongoingChat[0].timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueChatButton} onPress={continueChat}>
              <Text style={styles.continueChatButtonText}>Continue Chat</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {chatHistory.length > 0 ? (
          <>
            <FlatList
              data={chatHistory}
              renderItem={renderHistoryItem}
              keyExtractor={(item) => item.id}
              style={styles.historyList}
            />
            <TouchableOpacity style={styles.startChatButton} onPress={startNewChat}>
              <Text style={styles.startChatText}>Start New Chat</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.center}>
            <Text style={styles.noHistoryText}>No chat history yet.</Text>
            <TouchableOpacity style={styles.startChatButton} onPress={startNewChat}>
              <Text style={styles.startChatText}>Start New Chat</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserChatScreen;