// src/screens/SecurityScreen/TwoFactorAuthToggleWidget.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { securityService } from '../../services/securityService';
import Constants from 'expo-constants';
import { TOTP } from 'jsotp';
import QRCode from 'react-native-qrcode-svg';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/TwoFactorAuthToggleWidgetStyles';
import colors from '../../styles/colors';

export const TwoFactorAuthToggleWidget = ({ user, onTwoFactorStatusChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [action, setAction] = useState('enable');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const appName = Constants.expoConfig?.name || 'MyApp';
  const inputRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      console.log('Checking 2FA status for UID:', user.uid);
      securityService.getTwoFactorAuthStatus(user.uid).then((enabled) => {
        setIsEnabled(enabled);
        console.log('Initial 2FA status:', enabled);
      }).catch((error) => {
        setErrorMessage('Failed to load 2FA status');
        console.log('Error checking 2FA status:', error.message);
      });
    }
  }, [user]);

  const generateBase32Secret = (length = 16) => {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < length; i++) {
      secret += base32Chars[Math.floor(Math.random() * base32Chars.length)];
    }
    return secret;
  };

  const formatSecretKey = (secret) => {
    return secret.match(/.{1,4}/g)?.join('-') || secret;
  };

  const handleToggle = (value) => {
    if (!user || !user.uid) {
      Toast.show({ type: 'error', text1: 'User Error', text2: 'No user data available' });
      setErrorMessage('No user data available');
      return;
    }
    setAction(value ? 'enable' : 'disable');
    if (value) {
      const newSecret = generateBase32Secret();
      setSecretKey(newSecret);
      const otpauthUrl = `otpauth://totp/${encodeURIComponent(user.email)}?secret=${newSecret}&issuer=${encodeURIComponent(appName)}`;
      setQrCodeUrl(otpauthUrl);
    }
    setModalVisible(true);
    setErrorMessage('');
    setVerificationCode('');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      Toast.show({ type: 'error', text1: 'Invalid Code', text2: 'Enter a valid 6-digit code' });
      setErrorMessage('Enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Verifying TOTP code for enable:', verificationCode, 'with secret:', secretKey);
      const totp = new TOTP(secretKey);
      const isValid = totp.verify(verificationCode);
      if (!isValid) {
        throw new Error('Invalid verification code');
      }
      await securityService.setTwoFactorAuth(user.uid, true, secretKey);
      console.log('2FA enabled successfully');
      Toast.show({ type: 'success', text1: '2FA Enabled', text2: 'Two-factor authentication is now active' });
      setIsEnabled(true);
      onTwoFactorStatusChange(true);
      setModalVisible(false);
    } catch (error) {
      console.log('Error enabling 2FA:', error.message);
      const errorText = error.message === 'Invalid verification code'
        ? 'Incorrect code. Check your authenticator app and try again.'
        : 'Failed to enable 2FA. Please try again.';
      Toast.show({ type: 'error', text1: '2FA Enable Failed', text2: errorText });
      setErrorMessage(errorText);
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      Toast.show({ type: 'error', text1: 'Invalid Code', text2: 'Enter a valid 6-digit code' });
      setErrorMessage('Enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Fetching stored TOTP secret for disable');
      const storedSecret = await AsyncStorage.getItem(`totpSecret_${user.uid}`);
      if (!storedSecret) {
        throw new Error('No 2FA secret found');
      }
      console.log('Verifying TOTP code for disable:', verificationCode, 'with secret:', storedSecret);
      const totp = new TOTP(storedSecret);
      const isValid = totp.verify(verificationCode);
      if (!isValid) {
        throw new Error('Invalid verification code');
      }
      await securityService.setTwoFactorAuth(user.uid, false);
      console.log('2FA disabled successfully');
      Toast.show({ type: 'success', text1: '2FA Disabled', text2: 'Two-factor authentication is now off' });
      setIsEnabled(false);
      onTwoFactorStatusChange(false);
      setModalVisible(false);
    } catch (error) {
      console.log('Error disabling 2FA:', error.message);
      const errorText = error.message === 'Invalid verification code'
        ? 'Incorrect code. Check your authenticator app and try again.'
        : error.message === 'No 2FA secret found'
        ? '2FA not properly set up. Contact support.'
        : 'Failed to disable 2FA. Try again.';
      Toast.show({ type: 'error', text1: '2FA Disable Failed', text2: errorText });
      setErrorMessage(errorText);
      setIsEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.optionContainer}>
        <Ionicons name="finger-print" size={24} color={colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>Two-Factor Auth</Text>
        <Switch
          trackColor={{ false: colors.textLight, true: colors.primary }}
          thumbColor={isEnabled ? colors.white : colors.surface}
          onValueChange={handleToggle}
          value={isEnabled}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {}} // Prevent closing via back button
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            style={styles.keyboardAvoidingContainer}
          >
            <View style={styles.sheetOverlay}>
              <View style={styles.sheetContainer}>
                <View style={styles.header}>
                  <Ionicons name="finger-print" size={24} color={colors.primary} style={styles.headerIcon} />
                  <Text style={styles.title}>{action === 'enable' ? 'Enable 2FA' : 'Disable 2FA'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
                <View style={styles.content}>
                  {action === 'enable' ? (
                    <>
                      <Text style={styles.messageText}>
                        {loading ? 'Verifying your code...' : 'Set up 2FA with your authenticator app.'}
                      </Text>
                      {qrCodeUrl && !loading && (
                        <>
                          <QRCode
                            value={qrCodeUrl}
                            size={180}
                            color={colors.textDark}
                            backgroundColor={colors.surface}
                            style={styles.qrCode}
                          />
                          <Text style={styles.instructionText}>
                            Scan this QR code with Google Authenticator or similar app.
                          </Text>
                          <View style={styles.manualCodeContainer}>
                            <Text style={styles.manualCodeLabel}>Or enter this code:</Text>
                            <Text style={styles.manualCode}>{formatSecretKey(secretKey)}</Text>
                          </View>
                        </>
                      )}
                    </>
                  ) : (
                    <Text style={styles.messageText}>
                      {loading ? 'Verifying your code...' : 'Enter the code from your authenticator app to disable.'}
                    </Text>
                  )}
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={colors.textLight}
                    returnKeyType="done"
                  />
                  {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, loading && styles.disabledButton]}
                      onPress={action === 'enable' ? handleEnable2FA : handleDisable2FA}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={action === 'disable' && !loading ? [colors.error, colors.errorDark] : [colors.primary, colors.primaryDark]}
                        style={styles.gradientButton}
                      >
                        <Ionicons name="checkmark-outline" size={22} color={colors.white} style={styles.buttonIcon} />
                        <Text style={styles.actionButtonText}>
                          {loading ? 'Processing...' : (action === 'enable' ? 'Enable 2FA' : 'Disable 2FA')}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
};