// src/screens/AccountScreen/SendFundWidget.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { flutterwaveService } from '../../services/flutterwaveService';
import { securityService } from '../../services/securityService';
import styles from '../../styles/SendFundWidgetStyles';
import colors from '../../styles/colors';
import { formatNaira, describeAmount } from '../../utils/formatCurrency';

const PREDEFINED_AMOUNTS = [500, 1000, 5000, 10000, 15000, 20000];

export const SendFundWidget = ({ visible, onClose, onSendConfirm, user, balance }) => {
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // 'input', 'auth', 'agreement', 'sending', 'authError'
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [requiresAuth, setRequiresAuth] = useState(false);

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setAmount(cleaned);
  };

  const handlePredefinedAmount = (value) => {
    setAmount(value.toString());
  };

  const handleRecipientChange = async (text) => {
    setRecipient(text);
    if (text.length >= 10) {
      const senderFinance = await flutterwaveService.getFinanceData(user.uid);
      const senderAccountNumber = senderFinance?.virtualAccount?.accountNumber;

      if (text === senderAccountNumber) {
        setRecipientName('Your Own Account');
        Toast.show({
          type: 'error',
          text1: 'Cannot Send to Self',
          text2: 'You cannot send funds to your own account',
        });
      } else {
        const userData = await flutterwaveService.getUserByAccountNumber(text);
        setRecipientName(userData ? userData.name : 'Not Found');
      }
    } else {
      setRecipientName('');
    }
  };

  const checkAndProceed = async () => {
    const parsedAmount = parseFloat(amount);

    if (!recipient || !amount) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter recipient and amount' });
      return;
    }
    if (!recipientName || recipientName === 'Not Found') {
      Toast.show({ type: 'error', text1: 'Invalid Recipient', text2: 'Recipient account not found' });
      return;
    }
    if (recipientName === 'Your Own Account') {
      Toast.show({ type: 'error', text1: 'Cannot Send to Self', text2: 'You cannot send funds to your own account' });
      return;
    }

    try {
      const [hasPin, hasFaceId] = await Promise.all([
        securityService.hasPin(user.uid),
        securityService.getFaceIdStatus(user.uid),
      ]);
      if (hasPin || hasFaceId) {
        setRequiresAuth(true);
        setStep('auth');
      } else {
        setStep('agreement');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to check security settings' });
      console.error('Error checking security settings:', error);
    }
  };

  const handleAuthentication = async () => {
    setLoading(true);
    setAuthError('');

    try {
      const pinValid = await securityService.verifyPin(user.uid, pin);
      if (pinValid) {
        setStep('agreement');
      } else {
        setAuthError('Incorrect PIN. Please try again.');
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    setStep('sending');
    setLoading(true);
    const parsedAmount = parseFloat(amount);

    const result = await flutterwaveService.sendFunds(user.uid, recipient, parsedAmount);
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Funds Sent',
        text2: `Successfully sent ${formatNaira(parsedAmount)} to ${result.recipientName}`,
      });
      // Trigger cache clearing and refresh via callback
      if (onSendConfirm) {
        await onSendConfirm();
      }
      onClose();
    } else if (result.reason === 'Please set up a PIN or Face ID in Security settings to authorize transactions') {
      setStep('authError');
    } else {
      Toast.show({ type: 'error', text1: 'Send Failed', text2: result.reason });
      setStep('input');
    }
    setLoading(false);
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.upperOverlay} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingContainer}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Ionicons name="paper-plane-outline" size={24} color={colors.error} style={styles.headerIcon} />
              <Text style={styles.title}>Send Funds</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            {step === 'input' ? (
              <>
                <View style={styles.infoRow}>
                  <Ionicons name="wallet-outline" size={20} color={colors.textDark} style={styles.infoIcon} />
                  <Text style={styles.infoText}>Your Balance: {formatNaira(balance)}</Text>
                </View>
                <Text style={styles.label}>Recipient Account Number</Text>
                <TextInput
                  style={styles.input}
                  value={recipient}
                  onChangeText={handleRecipientChange}
                  placeholder="e.g., 1234567890"
                  placeholderTextColor={colors.textLight}
                />
                {recipientName && (
                  <Text
                    style={[
                      styles.recipientName,
                      recipientName === 'Your Own Account' ? styles.errorText : null,
                    ]}
                  >
                    Recipient: {recipientName}
                  </Text>
                )}
                <Text style={styles.label}>Amount (₦)</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="numeric"
                  placeholder="Min: ₦500, Max: ₦20,000"
                  placeholderTextColor={colors.textLight}
                />
                <View style={styles.predefinedContainer}>
                  {PREDEFINED_AMOUNTS.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.predefinedButton,
                        amount === value.toString() && styles.predefinedButtonSelected,
                      ]}
                      onPress={() => handlePredefinedAmount(value)}
                    >
                      <Text
                        style={[
                          styles.predefinedText,
                          amount === value.toString() && styles.predefinedTextSelected,
                        ]}
                      >
                        {formatNaira(value)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {amount && (
                  <View style={styles.amountPreviewContainer}>
                    <Text style={styles.amountPreview}>{formatNaira(amount)}</Text>
                    <Text style={styles.amountWords}>{describeAmount(amount)}</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.sendButton} onPress={checkAndProceed}>
                  <Ionicons name="paper-plane-outline" size={22} color={colors.white} style={styles.buttonIcon} />
                  <Text style={styles.sendButtonText}>Send Funds</Text>
                </TouchableOpacity>
              </>
            ) : step === 'auth' ? (
              <View style={styles.authContainer}>
                <Ionicons name="lock-closed-outline" size={40} color={colors.primary} style={styles.authIcon} />
                <Text style={styles.authText}>Enter your PIN to authorize this transaction</Text>
                <TextInput
                  style={styles.input}
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  placeholderTextColor={colors.textLight}
                  secureTextEntry
                />
                {authError ? <Text style={styles.errorText}>{authError}</Text> : null}
                <TouchableOpacity
                  style={[styles.authButton, loading && styles.disabledButton]}
                  onPress={handleAuthentication}
                  disabled={loading}
                >
                  <Text style={styles.authButtonText}>
                    {loading ? 'Verifying...' : 'Authorize'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelAuthButton} onPress={() => setStep('input')}>
                  <Text style={styles.cancelAuthButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : step === 'agreement' ? (
              <View style={styles.agreementContainer}>
                <Text style={styles.agreementText}>
                  Send {formatNaira(amount)} to {recipientName} ({recipient})?
                </Text>
                <View style={styles.agreementButtons}>
                  <TouchableOpacity style={styles.agreeButton} onPress={handleSend}>
                    <Text style={styles.agreeButtonText}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setStep('input')}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : step === 'sending' ? (
              <View style={styles.sendingContainer}>
                <Text style={styles.sendingText}>Sending {formatNaira(amount)}...</Text>
                <Ionicons name="hourglass-outline" size={30} color={colors.primary} style={styles.sendingIcon} />
              </View>
            ) : step === 'authError' ? (
              <View style={styles.authErrorContainer}>
                <Ionicons name="lock-closed-outline" size={40} color={colors.error} style={styles.authErrorIcon} />
                <Text style={styles.authErrorText}>
                  Please set up a PIN or Face ID in Security settings to authorize transactions
                </Text>
                <TouchableOpacity style={styles.closeErrorButton} onPress={() => setStep('input')}>
                  <Text style={styles.closeErrorButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};