// src/services/flutterwaveService.js
import { FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY } from '@env';
import { db } from '../config/firebaseConfig';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { formatNaira } from '../utils/formatCurrency';

const BASE_URL = 'https://api.flutterwave.com/v3';
const IS_TEST_MODE = true; // Toggle this to false for live mode

export const flutterwaveService = {
  async generateVirtualAccount(user) {
    if (IS_TEST_MODE) {
      // Simulate unique account number in test mode
      const mockAccountNumber = `99${Math.floor(10000000 + Math.random() * 90000000)}`; // e.g., 9912345678
      const accountData = {
        account_number: mockAccountNumber,
        bank_name: 'Mock Bank',
      };
      await this.storeVirtualAccount(user.uid, accountData);
      console.log('Generated mock virtual account:', accountData);
      return accountData;
    }

    const url = `${BASE_URL}/virtual-account-numbers`;
    const headers = {
      'Authorization': `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
      'Content-Type': 'application/json',
    };
    const body = JSON.stringify({
      email: user.email || `${user.uid}@example.com`,
      amount: 100,
      tx_ref: `VA_${user.uid}_${Date.now()}`,
      narration: `${user.displayName || 'User'} Virtual Account`,
    });

    try {
      const response = await fetch(url, { method: 'POST', headers, body });
      const data = await response.json();
      if (data.status === 'success') {
        const accountData = data.data;
        await this.storeVirtualAccount(user.uid, accountData);
        console.log('Generated live virtual account:', accountData);
        return accountData;
      }
      console.error('Failed to generate virtual account:', data);
      return null;
    } catch (error) {
      console.error('Error generating virtual account:', error);
      return null;
    }
  },

  async storeVirtualAccount(uid, accountData) {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        finance: {
          virtualAccount: {
            accountNumber: accountData.account_number,
            bankName: accountData.bank_name,
            createdAt: new Date().toISOString(),
          },
          balance: 0.0,
          topUpHistory: [],
          sendHistory: [],
        },
      },
      { merge: true }
    );
  },

  async getFinanceData(uid) {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().finance || null;
    }
    return null;
  },

  async checkTopUpLimits(uid, amount) {
    const financeData = await this.getFinanceData(uid);
    const history = financeData?.topUpHistory || [];
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const singleLimit = 50000;
    const weeklyLimit = 200000;
    const monthlyLimit = 1000000;

    if (amount > singleLimit) {
      return { allowed: false, reason: `Amount exceeds single transaction limit of ${formatNaira(singleLimit)}` };
    }

    const weeklyTotal = history
      .filter((entry) => new Date(entry.date) >= oneWeekAgo && entry.status === 'success')
      .reduce((sum, entry) => sum + entry.amount, 0);
    if (weeklyTotal + amount > weeklyLimit) {
      return { allowed: false, reason: `Weekly limit of ${formatNaira(weeklyLimit)} exceeded` };
    }

    const monthlyTotal = history
      .filter((entry) => new Date(entry.date) >= oneMonthAgo && entry.status === 'success')
      .reduce((sum, entry) => sum + entry.amount, 0);
    if (monthlyTotal + amount > monthlyLimit) {
      return { allowed: false, reason: `Monthly limit of ${formatNaira(monthlyLimit)} exceeded` };
    }

    return { allowed: true };
  },

  async logTopUp(uid, amount, status, txRef) {
    const userRef = doc(db, 'users', uid);
    const currentFinance = await this.getFinanceData(uid);
    const topUpHistory = currentFinance?.topUpHistory || [];
    const newBalance = status === 'success' ? (currentFinance?.balance || 0) + amount : currentFinance?.balance || 0;

    topUpHistory.push({
      amount,
      date: new Date().toISOString(),
      type: 'top_up',
      status,
      txRef,
    });

    await setDoc(
      userRef,
      {
        finance: {
          ...currentFinance,
          balance: newBalance,
          topUpHistory,
          sendHistory: currentFinance?.sendHistory || [],
        },
      },
      { merge: true }
    );
    return { ...currentFinance, balance: newBalance, topUpHistory };
  },

  async checkSendLimits(uid, amount) {
    const financeData = await this.getFinanceData(uid);
    const history = financeData?.sendHistory || [];
    const balance = financeData?.balance || 0;
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const singleLimit = 20000;
    const weeklyLimit = 100000;
    const monthlyLimit = 300000;
    const minAmount = 500;

    if (amount < minAmount) {
      return { allowed: false, reason: `Amount must be at least ${formatNaira(minAmount)}` };
    }
    if (amount > singleLimit) {
      return { allowed: false, reason: `Amount exceeds single transaction limit of ${formatNaira(singleLimit)}` };
    }
    if (amount > balance) {
      return { allowed: false, reason: `Insufficient balance: ${formatNaira(balance)} available` };
    }

    const weeklyTotal = history
      .filter((entry) => new Date(entry.date) >= oneWeekAgo && entry.status === 'success')
      .reduce((sum, entry) => sum + entry.amount, 0);
    if (weeklyTotal + amount > weeklyLimit) {
      return { allowed: false, reason: `Weekly limit of ${formatNaira(weeklyLimit)} exceeded` };
    }

    const monthlyTotal = history
      .filter((entry) => new Date(entry.date) >= oneMonthAgo && entry.status === 'success')
      .reduce((sum, entry) => sum + entry.amount, 0);
    if (monthlyTotal + amount > monthlyLimit) {
      return { allowed: false, reason: `Monthly limit of ${formatNaira(monthlyLimit)} exceeded` };
    }

    return { allowed: true };
  },

  async getUserByAccountNumber(accountNumber) {
    console.log('Querying for accountNumber:', accountNumber);
    const q = query(collection(db, 'users'), where('finance.virtualAccount.accountNumber', '==', accountNumber));
    const querySnapshot = await getDocs(q);
    console.log('Query result size:', querySnapshot.size);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      console.log('User found:', userDoc.id, userData.displayName, userData.finance.virtualAccount.accountNumber);
      return { uid: userDoc.id, name: userData.displayName || 'Unknown User', ...userData };
    }
    console.log('No user found for accountNumber:', accountNumber);
    return null;
  },

  async checkAuthSetup(uid) {
    console.log('Checking auth setup for UID:', uid);
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    if (docSnap.exists()) {
      const security = docSnap.data();
      console.log('Security data:', security);
      return security.pin || security.faceIdEnabled || false;
    }
    console.log('No security document found for UID:', uid);
    return false;
  },

  async sendFunds(senderUid, recipientAccountNumber, amount) {
    console.log('Sending funds from:', senderUid, 'to:', recipientAccountNumber, 'amount:', amount);
    const senderFinance = await this.getFinanceData(senderUid);
    const recipient = await this.getUserByAccountNumber(recipientAccountNumber);

    if (!recipient) {
      console.log('Recipient not found');
      return { success: false, reason: 'Recipient account not found' };
    }
    console.log('Recipient found:', recipient.name, recipient.uid);

    if (recipient.uid === senderUid) {
      console.log('Self-send attempt detected');
      return { success: false, reason: 'Cannot send to your own account' };
    }

    const limitCheck = await this.checkSendLimits(senderUid, amount);
    if (!limitCheck.allowed) {
      console.log('Limit check failed:', limitCheck.reason);
      return { success: false, reason: limitCheck.reason };
    }

    const authSetup = await this.checkAuthSetup(senderUid);
    if (!authSetup) {
      console.log('Auth setup missing');
      return { success: false, reason: 'Please set up a PIN or Face ID in Security settings to authorize transactions' };
    }

    const txRef = `SEND_${senderUid}_${Date.now()}`;
    const senderNewBalance = senderFinance.balance - amount;
    const recipientFinance = await this.getFinanceData(recipient.uid);
    const recipientNewBalance = (recipientFinance?.balance || 0) + amount;

    const senderRef = doc(db, 'users', senderUid);
    const senderHistory = senderFinance?.sendHistory || [];
    senderHistory.push({
      amount,
      date: new Date().toISOString(),
      type: 'send',
      status: 'success',
      txRef,
      to: recipientAccountNumber,
    });
    await setDoc(
      senderRef,
      {
        finance: {
          ...senderFinance,
          balance: senderNewBalance,
          sendHistory: senderHistory,
        },
      },
      { merge: true }
    );

    const recipientRef = doc(db, 'users', recipient.uid);
    const recipientHistory = recipientFinance?.topUpHistory || [];
    recipientHistory.push({
      amount,
      date: new Date().toISOString(),
      type: 'receive',
      status: 'success',
      txRef,
      from: senderFinance.virtualAccount.accountNumber,
    });
    await setDoc(
      recipientRef,
      {
        finance: {
          ...recipientFinance,
          balance: recipientNewBalance,
          topUpHistory: recipientHistory,
        },
      },
      { merge: true }
    );

    console.log('Funds sent successfully, txRef:', txRef);
    return { success: true, txRef, recipientName: recipient.name };
  },
};