// src/screens/AccountScreen/FundingScreenWidget.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { flutterwaveService } from '../../services/flutterwaveService';
import { TopUpWidget } from './TopUpWidget';
import { HistoryWidget } from './HistoryWidget';
import { SendFundWidget } from './SendFundWidget';
import styles from '../../styles/FundingScreenWidgetStyles';
import colors from '../../styles/colors';
import { formatNaira } from '../../utils/formatCurrency'; 

export const FundingScreenWidget = ({ user }) => {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTopUpSheet, setShowTopUpSheet] = useState(false);
  const [showHistorySheet, setShowHistorySheet] = useState(false);
  const [showSendSheet, setShowSendSheet] = useState(false);

  useEffect(() => {
    fetchFinanceData();
  }, [user.uid]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const data = await flutterwaveService.getFinanceData(user.uid);
      setFinanceData(data);
    } catch (error) {
      console.error('Error fetching finance data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch finance data',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = () => {
    setShowTopUpSheet(true);
  };

  const handleHistory = () => {
    setShowHistorySheet(true);
  };

  const handleSend = () => {
    setShowSendSheet(true);
  };

  const copyAccountNumber = async () => {
    if (financeData?.virtualAccount?.accountNumber) {
      await Clipboard.setStringAsync(financeData.virtualAccount.accountNumber);
      Toast.show({
        type: 'success',
        text1: 'Copied',
        text2: 'Account number copied to clipboard!',
      });
    }
  };

  const onTopUpConfirm = async () => {
    await fetchFinanceData();
  };

  const onSendConfirm = async () => {
    await fetchFinanceData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const virtualAccount = financeData?.virtualAccount || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={24} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.title}>Funding Account</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Ionicons name="card-outline" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Account Number</Text>
          <Text style={styles.value}>{virtualAccount.accountNumber || 'Not set'}</Text>
          {virtualAccount.accountNumber && (
            <TouchableOpacity onPress={copyAccountNumber} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Bank Name</Text>
          <Text style={styles.value}>{virtualAccount.bankName || 'Not set'}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={20} color={colors.textDark} style={styles.icon} />
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.value}>{formatNaira(financeData?.balance || 0)}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTopUp} disabled={loading}>
          <Ionicons name="cash-outline" size={24} color={colors.primary} />
          <Text style={styles.buttonText}>Top Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleHistory} disabled={loading}>
          <Ionicons name="time-outline" size={24} color={colors.textDark} />
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSend} disabled={loading}>
          <Ionicons name="paper-plane-outline" size={24} color={colors.error} />
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <TopUpWidget
        visible={showTopUpSheet}
        onClose={() => setShowTopUpSheet(false)}
        user={user}
        onConfirm={onTopUpConfirm}
      />
      <HistoryWidget
        visible={showHistorySheet}
        onClose={() => setShowHistorySheet(false)}
        topUpHistory={financeData?.topUpHistory || []} // Pass topUpHistory (includes receives)
        sendHistory={financeData?.sendHistory || []} // Pass sendHistory
      />
      <SendFundWidget
        visible={showSendSheet}
        onClose={() => setShowSendSheet(false)}
        onSendConfirm={onSendConfirm}
        user={user}
        balance={financeData?.balance || 0}
      />
    </View>
  );
};