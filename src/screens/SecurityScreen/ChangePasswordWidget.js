// src/screens/SecurityScreen/ChangePasswordWidget.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { securityService } from '../../services/securityService';
import styles from '../../styles/ChangePasswordWidgetStyles';
import colors from '../../styles/colors';

export const ChangePasswordWidget = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [modalVisible]);

  const handleOpenModal = () => {
    if (!user || !user.uid) {
      Toast.show({ type: 'error', text1: 'User Error', text2: 'No user data available' });
      return;
    }
    setModalVisible(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setTimeout(() => currentPasswordRef.current?.focus(), 100);
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setErrorMessage('New password fields are required');
      Toast.show({ type: 'error', text1: 'Input Error', text2: 'Please fill in new password fields' });
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters');
      Toast.show({ type: 'error', text1: 'Password Error', text2: 'Password too short' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match');
      Toast.show({ type: 'error', text1: 'Password Error', text2: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      await securityService.changePassword(user.uid, currentPassword, newPassword);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Password changed successfully' });
      setModalVisible(false);
    } catch (error) {
      console.log('Error changing password:', error.message);
      let errorText = 'Failed to change password. Please try again.';
      if (error.message.includes('wrong-password')) {
        errorText = 'Current password is incorrect';
      } else if (error.message.includes('No email')) {
        errorText = 'No email linked. Please link an email first.';
      }
      setErrorMessage(errorText);
      Toast.show({ type: 'error', text1: 'Change Failed', text2: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.optionContainer} onPress={handleOpenModal}>
        <Ionicons name="key-outline" size={24} color={colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      <Modal transparent animationType="none" visible={modalVisible}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={styles.keyboardAvoidingContainer}
          >
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
              <Animated.View style={{ opacity: fadeAnim }}>
                <View style={styles.header}>
                  <Ionicons name="key-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                  <Text style={styles.title}>Change Password</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Processing...</Text>
                  </View>
                ) : (
                  <View style={styles.content}>
                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        ref={currentPasswordRef}
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Current Password (if set)"
                        placeholderTextColor={colors.textLight}
                        secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() => newPasswordRef.current?.focus()}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Ionicons name="key-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        ref={newPasswordRef}
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New Password"
                        placeholderTextColor={colors.textLight}
                        secureTextEntry
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Ionicons name="lock-open-outline" size={20} color={colors.primary} style={styles.inputIcon} />
                      <TextInput
                        ref={confirmPasswordRef}
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm New Password"
                        placeholderTextColor={colors.textLight}
                        secureTextEntry
                        returnKeyType="done"
                      />
                    </View>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.disabledButton]}
                      onPress={handleChangePassword}
                      disabled={loading}
                    >
                      <Ionicons name="checkmark-outline" size={22} color={colors.white} style={styles.buttonIcon} />
                      <Text style={styles.actionButtonText}>Change Password</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </>
  );
};