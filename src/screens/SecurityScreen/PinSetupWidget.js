// src/screens/SecurityScreen/PinSetupWidget.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { securityService } from '../../services/securityService';
import styles from '../../styles/PinSetupWidgetStyles';
import colors from '../../styles/colors';

export const PinSetupWidget = ({ user, onPinStatusChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [action, setAction] = useState('enable'); // 'enable' or 'disable'

  useEffect(() => {
    if (user?.uid) {
      console.log('Checking PIN status for UID:', user.uid);
      securityService.hasPin(user.uid).then((exists) => {
        setIsEnabled(exists);
        console.log('Initial PIN status:', exists);
      }).catch((error) => {
        console.error('Error checking PIN status:', error.message);
      });
    }
  }, [user]);

  const handleToggle = (value) => {
    if (!user || !user.uid) {
      console.error('No valid user provided');
      Toast.show({ type: 'error', text1: 'User Error', text2: 'No user data available' });
      return;
    }
    setAction(value ? 'enable' : 'disable');
    setModalVisible(true);
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
    setErrorMessage('');
  };

  const handleConfirm = async () => {
    console.log('Handling PIN toggle action:', action, 'for UID:', user.uid);

    if (action === 'enable') {
      if (pin.length !== 4 || confirmPin.length !== 4) {
        console.log('PIN length invalid:', pin.length, confirmPin.length);
        Toast.show({ type: 'error', text1: 'Invalid PIN', text2: 'PIN must be 4 digits' });
        setErrorMessage('PIN must be 4 digits');
        return;
      }
      if (pin !== confirmPin) {
        console.log('PIN mismatch:', pin, confirmPin);
        Toast.show({ type: 'error', text1: 'PIN Mismatch', text2: 'PIN and confirmation do not match' });
        setErrorMessage('PIN and confirmation do not match');
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        console.log('Setting PIN for UID:', user.uid);
        await securityService.setPin(user.uid, pin);
        console.log('PIN enabled successfully');
        Toast.show({ type: 'success', text1: 'PIN Enabled', text2: 'Your PIN has been set' });
        setIsEnabled(true);
        onPinStatusChange(true);
        setModalVisible(false);
      } catch (error) {
        console.error('Error enabling PIN:', error.message, error.stack);
        const errorText = error.message === 'PIN must be a 4-digit number'
          ? 'PIN must be a 4-digit number'
          : 'Failed to enable PIN. Please try again.';
        Toast.show({ type: 'error', text1: 'PIN Enable Failed', text2: errorText });
        setErrorMessage(errorText);
        setIsEnabled(false); // Revert toggle if enable fails
      } finally {
        setLoading(false);
      }
    } else {
      if (currentPin.length !== 4) {
        console.log('Current PIN length invalid:', currentPin.length);
        Toast.show({ type: 'error', text1: 'Invalid PIN', text2: 'Current PIN must be 4 digits' });
        setErrorMessage('Current PIN must be 4 digits');
        return;
      }

      setLoading(true);
      setErrorMessage('');
      try {
        console.log('Disabling PIN for UID:', user.uid);
        await securityService.disablePin(user.uid, currentPin);
        console.log('PIN disabled successfully');
        Toast.show({ type: 'success', text1: 'PIN Disabled', text2: 'Your PIN has been removed' });
        setIsEnabled(false);
        onPinStatusChange(false);
        setModalVisible(false);
      } catch (error) {
        console.error('Error disabling PIN:', error.message, error.stack);
        const errorText = error.message === 'Incorrect PIN'
          ? 'Incorrect PIN'
          : 'Failed to disable PIN. Please try again.';
        Toast.show({ type: 'error', text1: 'PIN Disable Failed', text2: errorText });
        setErrorMessage(errorText);
        setIsEnabled(true); // Revert toggle if disable fails
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <View style={styles.optionContainer}>
        <Ionicons name="lock-closed-outline" size={24} color={colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>PIN Protection</Text>
        <Switch
          trackColor={{ false: colors.textLight, true: colors.primary }}
          thumbColor={isEnabled ? colors.white : colors.surface}
          onValueChange={handleToggle}
          value={isEnabled}
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.upperOverlay} onPress={() => setModalVisible(false)} />
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={styles.keyboardAvoidingContainer}
          >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.container}>
                <View style={styles.header}>
                  <Ionicons name="lock-closed-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                  <Text style={styles.title}>{action === 'enable' ? 'Enable PIN' : 'Disable PIN'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
                {action === 'enable' ? (
                  <>
                    <Text style={styles.label}>Enter 4-Digit PIN</Text>
                    <TextInput
                      style={styles.input}
                      value={pin}
                      onChangeText={setPin}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      placeholder="••••"
                      placeholderTextColor={colors.textLight}
                      autoFocus={true}
                    />
                    <Text style={styles.label}>Confirm PIN</Text>
                    <TextInput
                      style={styles.input}
                      value={confirmPin}
                      onChangeText={setConfirmPin}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      placeholder="••••"
                      placeholderTextColor={colors.textLight}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Enter Current PIN</Text>
                    <TextInput
                      style={styles.input}
                      value={currentPin}
                      onChangeText={setCurrentPin}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                      placeholder="••••"
                      placeholderTextColor={colors.textLight}
                      autoFocus={true}
                    />
                  </>
                )}
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <TouchableOpacity
                  style={[styles.actionButton, loading && styles.disabledButton, action === 'disable' && styles.disableButton]}
                  onPress={handleConfirm}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {loading ? (action === 'enable' ? 'Enabling...' : 'Disabling...') : (action === 'enable' ? 'Enable PIN' : 'Disable PIN')}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};