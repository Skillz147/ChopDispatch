// src/screens/AccountScreen/TopUpWidget.js
import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PayWithFlutterwave } from 'flutterwave-react-native';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import loadingAnimation from '../../../assets/lottie/loading.json';
import TopUpConfirmation from './TopUpConfirmation';
import { flutterwaveService } from '../../services/flutterwaveService';
import styles from '../../styles/TopUpWidgetStyles';
import colors from '../../styles/colors';
import { FLUTTERWAVE_PUBLIC_KEY } from '@env';
import { formatNaira, describeAmount } from '../../utils/formatCurrency';

const APP_NAME = Constants.expoConfig?.name || 'Your App';
const PREDEFINED_AMOUNTS = [1000, 3000, 5000, 10000, 15000, 20000];

export const TopUpWidget = ({ visible, onClose, user, onConfirm }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [weeklyLimitRemaining, setWeeklyLimitRemaining] = useState(0);
  const [step, setStep] = useState('input'); // 'input', 'agreement', 'payment'
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      checkWeeklyLimit();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 300, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const checkWeeklyLimit = async () => {
    const financeData = await flutterwaveService.getFinanceData(user.uid);
    const history = financeData?.topUpHistory || [];
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyTotal = history
      .filter((entry) => new Date(entry.date) >= oneWeekAgo && entry.status === 'success')
      .reduce((sum, entry) => sum + entry.amount, 0);
    setWeeklyLimitRemaining(200000 - weeklyTotal);
  };

  const generateTransactionRef = () => `TOPUP_${user.uid}_${Date.now()}`;

  const paymentOptions = {
    tx_ref: generateTransactionRef(),
    authorization: FLUTTERWAVE_PUBLIC_KEY,
    customer: {
      email: user.email || `${user.uid}@example.com`,
      name: user.displayName || 'User',
    },
    amount: parseFloat(amount) || 0,
    currency: 'NGN',
    payment_options: 'card,banktransfer',
    customizations: {
      title: 'Top Up Your Account',
      description: 'Add funds to your virtual account',
    },
  };

  const handleAmountChange = (text) => {
    const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    setAmount(cleaned);
  };

  const handlePredefinedAmount = (value) => {
    setAmount(value.toString());
  };

  const checkLimitsAndProceed = async () => {
    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid Amount', text2: 'Please enter a valid amount' });
      return;
    }

    const limitCheck = await flutterwaveService.checkTopUpLimits(user.uid, parsedAmount);
    if (!limitCheck.allowed) {
      Toast.show({ type: 'error', text1: 'Limit Exceeded', text2: limitCheck.reason });
      return;
    }

    setShowAgreement(true);
    setStep('agreement');
  };

  const handleAgreementAccept = () => {
    setShowAgreement(false);
    setStep('payment');
  };

  const handleRedirect = async (data) => {
    setIsProcessing(true);
    const status = data.status === 'successful' || data.status === 'completed' ? 'success' : 'failed';
    const response = {
      status,
      amount: parseFloat(amount),
      txRef: paymentOptions.tx_ref,
      reason: status === 'failed' ? 'Payment declined' : null,
    };

    await flutterwaveService.logTopUp(user.uid, response.amount, status, response.txRef);
    if (status === 'success') onConfirm();

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentResponse(response);
    }, 1500);
  };

  const handleConfirmationClose = () => {
    setPaymentResponse(null);
    setAmount('');
    setStep('input');
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <Modal transparent animationType="none" visible={visible && !paymentResponse}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingContainer}>
            <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
              <Animated.View style={{ opacity: fadeAnim }}>
                <View style={styles.header}>
                  <Ionicons name="cash-outline" size={24} color={colors.primary} style={styles.headerIcon} />
                  <Text style={styles.title}>Top Up Account</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
                {isProcessing ? (
                  <View style={styles.processingContainer}>
                    <Text style={styles.processingText}>Processing your payment...</Text>
                    <LottieView source={loadingAnimation} autoPlay loop style={styles.lottie} />
                    <Text style={styles.infoText}>Please wait a moment</Text>
                  </View>
                ) : step === 'input' ? (
                  <View style={styles.content}>
                    <Text style={styles.label}>Enter Amount (₦)</Text>
                    <TextInput
                      style={styles.input}
                      value={amount}
                      onChangeText={handleAmountChange}
                      keyboardType="numeric"
                      placeholder="e.g., 1000"
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
                    <TouchableOpacity style={styles.confirmButton} onPress={checkLimitsAndProceed}>
                      <Ionicons name="card-outline" size={22} color={colors.white} />
                      <Text style={styles.confirmButtonText}>Top Up Now</Text>
                    </TouchableOpacity>
                  </View>
                ) : step === 'agreement' ? (
                  <View style={styles.agreementContainer}>
                    <View style={styles.agreementCard}>
                      <View style={styles.agreementRow}>
                        <Ionicons name="calendar-outline" size={20} color={colors.primary} style={styles.agreementIcon} />
                        <Text style={styles.agreementText}>
                          Weekly Limit Remaining: {formatNaira(weeklyLimitRemaining)}
                        </Text>
                      </View>
                      <View style={styles.agreementRow}>
                        <Ionicons name="document-text-outline" size={20} color={colors.primary} style={styles.agreementIcon} />
                        <Text style={styles.agreementText}>
                          You agree to {APP_NAME}’s terms of service.
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => Linking.openURL('https://chopdispatch.com/terms-of-use')}
                        style={styles.termsLink}
                      >
                        <Text style={styles.termsLinkText}>Read Full Terms</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.agreementButtons}>
                      <TouchableOpacity style={styles.agreeButton} onPress={handleAgreementAccept}>
                        <Text style={styles.agreeButtonText}>Yes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setStep('input')}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : step === 'payment' ? (
                  <View style={styles.paymentContainer}>
                    <PayWithFlutterwave
                      onRedirect={handleRedirect}
                      options={paymentOptions}
                      customButton={(props) => (
                        <TouchableOpacity
                          style={[styles.confirmButton, props.isInitializing && styles.disabledButton]}
                          onPress={props.onPress}
                          disabled={props.disabled}
                        >
                          <Ionicons name="card-outline" size={22} color={colors.white} />
                          <Text style={styles.confirmButtonText}>Proceed to Payment</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ) : null}
              </Animated.View>
            </Animated.View>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
      {paymentResponse && (
        <TopUpConfirmation paymentResponse={paymentResponse} onClose={handleConfirmationClose} />
      )}
    </>
  );
};