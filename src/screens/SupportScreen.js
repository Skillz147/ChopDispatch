import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../context/AuthContext";
import { db } from "../config/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import colors from "../styles/colors";
import styles from "../styles/SupportScreenStyles";
import faqsData from "../config/faqsData.json";
import quickContactData from "../config/quickContactData.json";

const SupportScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // Control form visibility

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const toggleForm = () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to send a support message.");
      return;
    }
    setIsFormVisible(!isFormVisible);
    setMessage(""); // Clear message when toggling
  };

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message before submitting.");
      return;
    }

    try {
      const supportRef = collection(db, "supportRequests");
      await addDoc(supportRef, {
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        email: user.email || "N/A",
        message: message.trim(),
        timestamp: serverTimestamp(),
        unread: true,
      });
      Alert.alert("Success", "Your support request has been submitted!");
      setMessage("");
      setIsFormVisible(false); // Close form after submission
    } catch (error) {
      console.error("Error submitting support request:", error);
      Alert.alert("Error", "Failed to submit your request. Please try again.");
    }
  };

  const handleLiveChat = () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to access live chat.");
      return;
    }
    navigation.navigate("UserChatScreen");
  };

  return (
    <View style={styles.container}>
      {/* Sticky Header Container */}
      <View style={styles.headerContainer}>
        <Icon name="headset" size={30} color={colors.primary} />
        <Text style={styles.headerTitle}>Support</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Contact Us Section Container */}
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contact Us</Text>
            </View>
            <View style={styles.sectionContent}>
              <Text style={styles.sectionDescription}>
                Have a question or issue? Send us a message, and we’ll get back to you soon!
              </Text>
              {!isFormVisible ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={toggleForm}
                  activeOpacity={0.7}
                  disabled={!user}
                >
                  <Text style={styles.submitButtonText}>Send a Message</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message here..."
                    placeholderTextColor={colors.textLight}
                    multiline
                    numberOfLines={4}
                    accessibilityLabel="Support Message"
                  />
                  <View style={styles.formButtonsContainer}>
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={toggleForm}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* FAQs Section Container */}
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
            </View>
            <View style={styles.sectionContent}>
              {faqsData.map((category, catIndex) => (
                <View key={catIndex} style={styles.faqCategoryContainer}>
                  <Text style={styles.faqCategoryTitle}>{category.category}</Text>
                  <View style={styles.faqItemsContainer}>
                    {category.items.map((faq, index) => {
                      const globalIndex = `${catIndex}-${index}`;
                      return (
                        <View key={index} style={styles.faqItemContainer}>
                          <TouchableOpacity
                            style={styles.faqQuestion}
                            onPress={() => toggleFAQ(globalIndex)}
                          >
                            <Text style={styles.faqQuestionText}>{faq.question}</Text>
                            <Icon
                              name={expandedFAQ === globalIndex ? "chevron-up" : "chevron-down"}
                              size={20}
                              color={colors.textDark}
                            />
                          </TouchableOpacity>
                          {expandedFAQ === globalIndex && (
                            <View style={styles.faqAnswerContainer}>
                              <Text style={styles.faqAnswer}>{faq.answer}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Contact Section Container */}
        <View style={styles.sectionContainer}>
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Contact</Text>
            </View>
            <View style={styles.sectionContent}>
              <View style={styles.contactItemsContainer}>
                {quickContactData.contactMethods.map((method, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.contactItemContainer}
                    onPress={method.type === "chat" ? handleLiveChat : null}
                    disabled={method.type !== "chat" || !user}
                  >
                    <Icon name={method.icon} size={20} color={colors.textDark} />
                    <View style={styles.contactTextContainer}>
                      <Text style={styles.contactLabel}>{method.label}</Text>
                      <Text style={styles.contactValue}>{method.value}</Text>
                      <Text style={styles.contactDescription}>{method.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.additionalInfoContainer}>
                <View style={styles.additionalInfoItem}>
                  <Text style={styles.additionalInfoLabel}>Support Hours</Text>
                  <Text style={styles.additionalInfoText}>
                    {quickContactData.additionalInfo.supportHours}
                  </Text>
                </View>
                <View style={styles.additionalInfoItem}>
                  <Text style={styles.additionalInfoLabel}>Response Time</Text>
                  <Text style={styles.additionalInfoText}>
                    {quickContactData.additionalInfo.responseTime}
                  </Text>
                </View>
                <View style={styles.additionalInfoItem}>
                  <Text style={styles.additionalInfoLabel}>Address</Text>
                  <Text style={styles.additionalInfoText}>
                    {quickContactData.additionalInfo.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SupportScreen;