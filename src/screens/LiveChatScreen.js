// src/screens/LiveChatScreen.js
import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { realtimeDB } from "../config/firebaseConfig";
import { ref, onValue, push, serverTimestamp, set } from "firebase/database";
import LiveChatUser from "../components/LiveChatUser";
import ChatInput from "../components/ChatInput";
import ChatResponder from "../components/ChatResponder";
import styles from "../styles/LiveChatScreenStyles";
import colors from "../styles/colors";

const LiveChatScreen = ({ route }) => {
  const { user } = useContext(AuthContext);
  const { startNew } = route.params || { startNew: false };
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [resetChat, setResetChat] = useState(false);
  const hasSavedOnUnmount = useRef(false);

  useEffect(() => {
    if (!user) return;

    hasSavedOnUnmount.current = false;

    if (startNew) {
      const chatRef = ref(realtimeDB, `liveChats/${user.uid}/messages`);
      set(chatRef, null);
      setMessages([]);
      setResetChat(true);
    }

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
        setMessages(fetchedMessages);
      } else {
        setMessages([]);
      }
    });

    return () => {
      if (messages.length > 0 && !hasSavedOnUnmount.current) {
        const historyRef = ref(realtimeDB, `chatHistory/${user.uid}`);
        push(historyRef, {
          messages: messages,
          endedAt: serverTimestamp(),
          endedBy: "navigation",
        });
        hasSavedOnUnmount.current = true;
      }
      chatListener();
    };
  }, [user, startNew]);

  const sendMessage = async () => {
    if (!user || !newMessage.trim()) return;

    const chatRef = ref(realtimeDB, `liveChats/${user.uid}/messages`);
    try {
      await push(chatRef, {
        text: newMessage,
        timestamp: serverTimestamp(),
        user: {
          _id: user.uid,
          name: user.displayName || "Anonymous",
        },
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleEndChat = () => {
    if (messages.length > 0) {
      const historyRef = ref(realtimeDB, `chatHistory/${user.uid}`);
      push(historyRef, {
        messages: messages,
        endedAt: serverTimestamp(),
        endedBy: "user",
      });
    }

    const chatRef = ref(realtimeDB, `liveChats/${user.uid}/messages`);
    set(chatRef, null);
    setMessages([]);
    setResetChat(true);
    navigation.navigate("UserChatScreen");
  };

  const handleBack = () => {
    navigation.navigate("UserChatScreen");
  };

  const renderMessage = ({ item }) => {
    const date = item.timestamp ? new Date(item.timestamp) : new Date();
    const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
      <View
        style={[
          styles.messageContainer,
          item.userId === user?.uid ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <View style={styles.messageFooter}>
          <Text style={styles.messageUser}>{item.userName}</Text>
          <Text style={styles.messageTimestamp}>{timeString}</Text>
        </View>
      </View>
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.textDark} />
        </TouchableOpacity>
        <LiveChatUser messages={messages} onEndChat={handleEndChat} isLiveChatScreen={true} />
      </View>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        inverted
        style={styles.messageList}
      />
      <ChatResponder
        userId={user.uid}
        userName={user.displayName}
        messages={messages}
        setMessages={setMessages}
        resetChat={resetChat}
      />
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
      />
    </View>
  );
};

export default LiveChatScreen;