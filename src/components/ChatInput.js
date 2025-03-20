// src/components/ChatInput.js
import React from "react";
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../styles/ChatInputStyles";
import colors from "../styles/colors";

const ChatInput = ({ newMessage, setNewMessage, sendMessage }) => {
  const handleSubmit = () => {
    if (newMessage.trim()) {
      sendMessage();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} // Adjust for iOS header/status bar
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textLight}
          onSubmitEditing={handleSubmit} // Send on return key
          returnKeyType="send" // Hint to keyboard
          blurOnSubmit={false} // Keep keyboard open after send
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;