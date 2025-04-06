import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard'; // Switched to Expo Clipboard
import Toast from 'react-native-toast-message';
import { flutterwaveService } from '../../services/flutterwaveService';
import styles from '../../styles/ProfileFinanceStyles';
import colors from '../../styles/colors';

const ProfileFinance = ({ user }) => {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFinanceData();
  }, [user]);

  const loadFinanceData = async () => {
    setLoading(true);
    const data = await flutterwaveService.getFinanceData(user.uid);
    setFinanceData(data);
    setLoading(false);
  };

  const generateVirtualAccount = async () => {
    setLoading(true);
    const accountData = await flutterwaveService.generateVirtualAccount(user);
    if (accountData) {
      await loadFinanceData();
      Toast.show({
        type: 'success',
        text1: 'Account Generated',
        text2: 'Your virtual account is ready!',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Generation Failed',
        text2: 'Could not create virtual account.',
      });
    }
    setLoading(false);
  };

  const copyAccountNumber = async () => {
    if (financeData?.virtualAccount?.accountNumber) {
      await Clipboard.setStringAsync(financeData.virtualAccount.accountNumber); // Expo Clipboard method
      Toast.show({
        type: 'success',
        text1: 'Copied',
        text2: 'Account number copied to clipboard!',
      });
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : financeData && financeData.virtualAccount ? (
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Ionicons name="card-outline" size={20} size={24} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>Account Number</Text>
            <Text style={styles.value}>{financeData.virtualAccount.accountNumber}</Text>
            <TouchableOpacity onPress={copyAccountNumber} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>Bank Name</Text>
            <Text style={styles.value}>{financeData.virtualAccount.bankName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={20} color={colors.primary} style={styles.icon} />
            <Text style={styles.label}>Balance</Text>
            <Text style={styles.value}>₦{financeData.balance.toFixed(2)}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noAccountContainer}>
          <Text style={styles.noDataText}>You currently don't have a Chop Dispatch Wavy account yet.</Text>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateVirtualAccount}
            disabled={loading}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.surface} style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Generate Virtual Account</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ProfileFinance;