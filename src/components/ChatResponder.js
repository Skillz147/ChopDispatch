// src/components/ChatResponder.js
import React, { useEffect, useState, useRef } from "react";
import { FlatList, TouchableOpacity, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ref, onValue, push, serverTimestamp, set } from "firebase/database";
import { collection, query, where, getDocs } from "firebase/firestore";
import { realtimeDB, firestoreDB } from "../config/firebaseConfig";
import botRules from "../data/botRules.json";
import styles from "../styles/ChatResponderStyles";
import colors from "../styles/colors";

const ChatResponder = ({ userId, userName, messages, setMessages, resetChat }) => {
  const [isFirstMessage, setIsFirstMessage] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [optionsHistory, setOptionsHistory] = useState([]);
  const [showLiveAgentButton, setShowLiveAgentButton] = useState(false);
  const [isWaitingForAgent, setIsWaitingForAgent] = useState(false);
  const [isAgentConnected, setIsAgentConnected] = useState(false);
  const hasSentGreeting = useRef(false);
  const hasResponded = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const messagesRef = ref(realtimeDB, `liveChats/${userId}/messages`);
    const unsubscribeMessages = onValue(messagesRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const messageList = Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
      const firstUserMessage = messageList.find((msg) => msg.user._id === userId);

      if (firstUserMessage && !isFirstMessage && !hasSentGreeting.current) {
        setIsFirstMessage(true);
        const initialOptions = botRules.options[botRules.initialGreeting.options];
        setCurrentOptions(initialOptions);
        setOptionsHistory([]);
        hasSentGreeting.current = true;
        await sendGreeting();
      }

      const latestMessage = messageList
        .filter((msg) => msg.user._id === userId)
        .sort((a, b) => b.timestamp - a.timestamp)[0];
      if (latestMessage) {
        const text = latestMessage.text.toLowerCase().trim();
        if (/live agent|human|person/i.test(text)) {
          setShowLiveAgentButton(true);
        } else if (text.match(/[A-Za-z0-9]{20}/)) {
          await handleOrderIdInput(text);
        } else {
          const matchedOption = findMatchingOption(text);
          if (matchedOption && !hasResponded.current) {
            await handleOptionSelect(matchedOption, true);
          }
        }
      }
    });

    const agentStatusRef = ref(realtimeDB, `liveChats/${userId}/agentStatus`);
    const unsubscribeAgentStatus = onValue(agentStatusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.status === "waiting") {
          setIsWaitingForAgent(true);
          setIsAgentConnected(false);
        } else if (data.status === "connected") {
          setIsWaitingForAgent(false);
          setIsAgentConnected(true);
          setShowLiveAgentButton(false);
          setCurrentOptions([]);
        } else {
          setIsWaitingForAgent(false);
          setIsAgentConnected(false);
        }
      } else {
        setIsWaitingForAgent(false);
        setIsAgentConnected(false);
      }
    });

    return () => {
      unsubscribeMessages();
      unsubscribeAgentStatus();
    };
  }, [userId, messages]);

  useEffect(() => {
    if (resetChat) {
      setIsFirstMessage(false);
      hasSentGreeting.current = false;
      setCurrentOptions([]);
      setOptionsHistory([]);
      setShowLiveAgentButton(false);
      setIsWaitingForAgent(false);
      setIsAgentConnected(false);
      hasResponded.current = false;
    }
  }, [resetChat]);

  const sendGreeting = async () => {
    const chatRef = ref(realtimeDB, `liveChats/${userId}/messages`);
    const greetingText = botRules.initialGreeting.text.replace("%name%", userName || "there");

    await new Promise((resolve) => setTimeout(resolve, botRules.personality.responseDelay));
    await push(chatRef, {
      text: greetingText,
      timestamp: serverTimestamp(),
      user: { _id: "bot", name: "Chat Bot" },
    });
  };

  const sendResponse = async (responseText, newOptionsKey = "") => {
    if (hasResponded.current) return;
    hasResponded.current = true;

    const chatRef = ref(realtimeDB, `liveChats/${userId}/messages`);
    await new Promise((resolve) => setTimeout(resolve, botRules.personality.responseDelay));
    await push(chatRef, {
      text: responseText,
      timestamp: serverTimestamp(),
      user: { _id: "bot", name: "Chat Bot" },
    });

    if (newOptionsKey && botRules.options[newOptionsKey]) {
      setOptionsHistory((prev) => [...prev, currentOptions]);
      const newOptions = botRules.options[newOptionsKey];
      setCurrentOptions(newOptions);
    } else {
      setCurrentOptions([]);
      setShowLiveAgentButton(true);
    }

    const latestUserMessage = messages.find((m) => m.userId === userId);
    if (latestUserMessage) {
      const trainerRef = ref(realtimeDB, `trainer/${userId}/${newOptionsKey || "general"}`);
      await push(trainerRef, {
        userMessage: latestUserMessage.text,
        botResponse: responseText,
        timestamp: serverTimestamp(),
      });
    }
  };

  const fetchOrders = async () => {
    console.log("Starting fetchOrders for userId:", userId);
    try {
      console.log("Firestore DB instance:", firestoreDB ? "Initialized" : "Not initialized");
      const ordersRef = collection(firestoreDB, "orders");
      console.log("Orders collection reference created");
      const q = query(ordersRef, where("userId", "==", userId));
      console.log("Query created with userId:", userId);
      const querySnapshot = await getDocs(q);
      console.log("Query executed, docs count:", querySnapshot.docs.length);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Orders mapped:", orders);

      if (orders.length === 0) {
        console.log("No orders found for this user");
        return "No orders found. Anything else I can help with?";
      }

      let response = "Here’s your order list:\n";
      orders.forEach((order, index) => {
        response += `${index + 1}. Order ID: ${order.id} - Total: ₦${order.totalAmount}\n`;
      });
      response += "Reply with an Order ID (e.g., 'HZecNPxLRkDXzgkDDVyp') for details!";
      console.log("Order list response prepared:", response);
      return response;
    } catch (error) {
      console.error("Fetch orders failed. Error:", error.message);
      console.error("Error code:", error.code);
      console.error("Error details:", error);
      return "Error fetching orders. Try again later.";
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const ordersRef = collection(firestoreDB, "orders");
      const q = query(ordersRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const order = querySnapshot.docs.find((doc) => doc.id === orderId);

      if (!order) {
        return "That order ID doesn’t exist. Try again or type 'Orders' for the list!";
      }

      const data = order.data();
      const createdAt = new Date(data.createdAt.toDate()).toLocaleString();
      const pickupTime = new Date(data.pickupTime).toLocaleString();
      return `
        Order ${orderId} Details:
        - Receiver: ${data.receiverName} (${data.receiverNumber})
        - Delivery Address: ${data.deliveryAddress}
        - Created: ${createdAt}
        - Pickup Time: ${pickupTime}
        - Total: ₦${data.totalAmount}
        - Delivery: ${data.deliveryOption}
        - Status: ${data.proofOfDelivery ? "Delivered" : "Pending"}
        Anything else?
      `;
    } catch (error) {
      console.error("Fetch order details failed:", error.message);
      return "Error fetching order details. Try again later.";
    }
  };

  const handleOrderIdInput = async (orderId) => {
    const responseText = await fetchOrderDetails(orderId);
    await sendResponse(responseText);
  };

  const findMatchingOption = (text) => {
    const allOptions = [
      ...botRules.options.mainOptions,
      ...botRules.options.orderSubOptions,
      ...botRules.options.accountSubOptions,
      ...botRules.options.appSubOptions,
      ...botRules.options.paymentSubOptions,
      ...botRules.options.feedbackSubOptions,
    ];
    return allOptions.find((opt) =>
      opt.keywords.some((kw) => text.includes(kw)) || text === opt.text.toLowerCase()
    );
  };

  const handleOptionSelect = async (option, autoRespond = false) => {
    if (option.isBack) {
      if (optionsHistory.length > 0) {
        const previousOptions = optionsHistory[optionsHistory.length - 1];
        setCurrentOptions(previousOptions);
        setOptionsHistory((prev) => prev.slice(0, -1));
      } else {
        const initialOptions = botRules.options[botRules.initialGreeting.options];
        setCurrentOptions(initialOptions);
        setOptionsHistory([]);
      }
      return;
    }

    if (!autoRespond) {
      const chatRef = ref(realtimeDB, `liveChats/${userId}/messages`);
      await push(chatRef, {
        text: option.text,
        timestamp: serverTimestamp(),
        user: { _id: userId, name: userName || "Anonymous" },
      });
    }

    hasResponded.current = false;
    let responseText = option.response;

    if (option.text === "Order Assistance" || 
        option.text === "Track My Order" || 
        option.text === "Check Order Status") {
      responseText = await fetchOrders();
    }

    await sendResponse(responseText, option.subOptions);
  };

  const handleConnectToLiveAgent = async () => {
    if (isWaitingForAgent || isAgentConnected) return;

    const agentStatusRef = ref(realtimeDB, `liveChats/${userId}/agentStatus`);
    await set(agentStatusRef, {
      status: "waiting",
      timestamp: serverTimestamp(),
    });

    const chatRef = ref(realtimeDB, `liveChats/${userId}/messages`);
    await push(chatRef, {
      text: "Connecting you to a live agent. Please wait...",
      timestamp: serverTimestamp(),
      user: { _id: "bot", name: "Chat Bot" },
    });
  };

  const renderOption = ({ item }) => (
    <TouchableOpacity
      style={styles.optionButton}
      onPress={() => (item.isLiveAgent ? handleConnectToLiveAgent() : handleOptionSelect(item))}
      disabled={item.isLiveAgent && (isWaitingForAgent || isAgentConnected)}
    >
      <Icon name={item.icon} size={20} color={colors.surface} />
      <Text style={styles.optionText}>{item.text}</Text>
    </TouchableOpacity>
  );

  const displayOptions = currentOptions.length > 0 ? currentOptions : [];
  const finalOptions = [
    ...displayOptions,
    ...(optionsHistory.length > 0
      ? [{ text: "Back", icon: "arrow-left", isBack: true }]
      : []),
    ...(showLiveAgentButton && !isAgentConnected
      ? [{ text: "Connect to Live Agent", icon: "account", isLiveAgent: true }]
      : []),
  ];

  return (
    <View style={styles.optionsContainer}>
      {isWaitingForAgent && (
        <Text style={styles.waitingText}>Waiting for a live agent...</Text>
      )}
      {finalOptions.length > 0 && !isAgentConnected ? (
        <FlatList
          data={finalOptions}
          renderItem={renderOption}
          keyExtractor={(item) => item.text}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.optionsContent}
        />
      ) : null}
    </View>
  );
};

export default ChatResponder;