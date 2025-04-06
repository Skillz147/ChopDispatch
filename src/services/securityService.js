// src/services/securityService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, auth } from '../config/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, linkWithCredential } from 'firebase/auth';
import * as Location from 'expo-location';
import * as Device from 'expo-device';
import bcrypt from 'react-native-bcrypt';

export const securityService = {
  // Set a 4-digit PIN
  async setPin(uid, pin) {
    if (!/^\d{4}$/.test(pin)) {
      throw new Error('PIN must be a 4-digit number');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);
    const securityRef = doc(db, 'security', uid);
    await setDoc(securityRef, { pin: hashedPin }, { merge: true });
    await AsyncStorage.setItem(`pin_${uid}`, hashedPin);
    console.log('PIN set for UID:', uid);
  },

  // Verify PIN
  async verifyPin(uid, pin) {
    const storedPin = await AsyncStorage.getItem(`pin_${uid}`);
    if (storedPin) {
      return bcrypt.compareSync(pin, storedPin);
    }
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    if (docSnap.exists() && docSnap.data().pin) {
      const hashedPin = docSnap.data().pin;
      await AsyncStorage.setItem(`pin_${uid}`, hashedPin);
      return bcrypt.compareSync(pin, hashedPin);
    }
    return false;
  },

  // Check if PIN is set
  async hasPin(uid) {
    const storedPin = await AsyncStorage.getItem(`pin_${uid}`);
    if (storedPin) return true;
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    return docSnap.exists() && !!docSnap.data().pin;
  },

  // Disable PIN (requires verification)
  async disablePin(uid, currentPin) {
    const isValid = await this.verifyPin(uid, currentPin);
    if (!isValid) {
      throw new Error('Incorrect PIN');
    }
    const securityRef = doc(db, 'security', uid);
    await updateDoc(securityRef, { pin: null });
    await AsyncStorage.removeItem(`pin_${uid}`);
    console.log('PIN disabled for UID:', uid);
  },

  // Enable/Disable Face ID
  async setFaceId(uid, enabled) {
    const securityRef = doc(db, 'security', uid);
    await setDoc(securityRef, { faceIdEnabled: enabled }, { merge: true });
    await AsyncStorage.setItem(`faceId_${uid}`, JSON.stringify(enabled));
    console.log('Face ID set to:', enabled, 'for UID:', uid);
  },

  // Check Face ID status
  async getFaceIdStatus(uid) {
    const storedStatus = await AsyncStorage.getItem(`faceId_${uid}`);
    if (storedStatus !== null) {
      return JSON.parse(storedStatus);
    }
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    const enabled = docSnap.exists() && docSnap.data().faceIdEnabled === true;
    await AsyncStorage.setItem(`faceId_${uid}`, JSON.stringify(enabled));
    return enabled;
  },

  // Enable/Disable 2FA
  async setTwoFactorAuth(uid, enabled, secret = null) {
    const securityRef = doc(db, 'security', uid);
    await setDoc(securityRef, { twoFactorAuth: enabled, totpSecret: enabled ? secret : null }, { merge: true });
    await AsyncStorage.setItem(`2fa_${uid}`, JSON.stringify(enabled));
    if (enabled && secret) {
      await AsyncStorage.setItem(`totpSecret_${uid}`, secret);
    } else {
      await AsyncStorage.removeItem(`totpSecret_${uid}`);
    }
    console.log('2FA set to:', enabled, 'for UID:', uid);
  },

  // Check 2FA status
  async getTwoFactorAuthStatus(uid) {
    const storedStatus = await AsyncStorage.getItem(`2fa_${uid}`);
    if (storedStatus !== null) {
      return JSON.parse(storedStatus);
    }
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    const enabled = docSnap.exists() && docSnap.data().twoFactorAuth === true;
    await AsyncStorage.setItem(`2fa_${uid}`, JSON.stringify(enabled));
    return enabled;
  },

  // Change Password (Updated)
  async changePassword(uid, currentPassword, newPassword) {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    // Check if user has an email/password provider
    const hasEmailProvider = user.providerData.some(provider => provider.providerId === 'password');
    
    if (hasEmailProvider) {
      // Reauthenticate with email/password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      console.log('Password changed successfully for email/password user');
    } else {
      // For phone-auth users, link an email/password credential first
      if (!user.email) throw new Error('No email associated with this account');
      const credential = EmailAuthProvider.credential(user.email, newPassword);
      await linkWithCredential(user, credential);
      console.log('Password linked and set for phone-auth user');
      // Note: This skips reauthentication since there's no current password to verify
    }
  },

  // Log and retrieve last login location
  async logLoginLocation(uid) {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    const loginData = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: new Date().toISOString(),
    };
    const history = await this.getLoginLocationHistory(uid);
    history.push(loginData);
    if (history.length > 5) history.shift();
    await AsyncStorage.setItem(`loginHistory_${uid}`, JSON.stringify(history));
    const securityRef = doc(db, 'security', uid);
    await setDoc(securityRef, { loginHistory: history }, { merge: true });
    console.log('Login location logged:', loginData);
  },

  // Get login location history
  async getLoginLocationHistory(uid) {
    const storedHistory = await AsyncStorage.getItem(`loginHistory_${uid}`);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
    const securityRef = doc(db, 'security', uid);
    const docSnap = await getDoc(securityRef);
    const history = docSnap.exists() && docSnap.data().loginHistory ? docSnap.data().loginHistory : [];
    await AsyncStorage.setItem(`loginHistory_${uid}`, JSON.stringify(history));
    return history;
  },

  // Check if security is set up
  async isSecuritySetup(uid) {
    const storedPin = await AsyncStorage.getItem(`pin_${uid}`);
    const pinExists = storedPin ? true : false;
    const faceIdEnabled = await this.getFaceIdStatus(uid);
    return pinExists || faceIdEnabled;
  },

    // Log and retrieve last login location (Updated)
    async logLoginLocation(uid) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const deviceInfo = {
        deviceName: Device.deviceName || 'Unknown Device',
        modelName: Device.modelName || 'Unknown Model',
        osName: Device.osName || 'Unknown OS',
        osVersion: Device.osVersion || 'Unknown Version',
      };
      const loginData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
        device: deviceInfo,
      };
      const history = await this.getLoginLocationHistory(uid);
      history.push(loginData);
      if (history.length > 5) history.shift(); // Keep last 5 logins
      await AsyncStorage.setItem(`loginHistory_${uid}`, JSON.stringify(history));
      const securityRef = doc(db, 'security', uid);
      await setDoc(securityRef, { loginHistory: history }, { merge: true });
      console.log('Login location logged:', loginData);
    },
  
    // Get login location history
    async getLoginLocationHistory(uid) {
      const storedHistory = await AsyncStorage.getItem(`loginHistory_${uid}`);
      if (storedHistory) {
        return JSON.parse(storedHistory);
      }
      const securityRef = doc(db, 'security', uid);
      const docSnap = await getDoc(securityRef);
      const history = docSnap.exists() && docSnap.data().loginHistory ? docSnap.data().loginHistory : [];
      await AsyncStorage.setItem(`loginHistory_${uid}`, JSON.stringify(history));
      return history;
    },
  
    // Listen for login location updates
    listenLoginLocationUpdates(uid, callback) {
      const securityRef = doc(db, 'security', uid);
      return onSnapshot(securityRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const history = data.loginHistory || [];
          callback(history);
        } else {
          callback([]);
        }
      }, (error) => {
        console.error('Error listening to login history:', error);
        callback([]);
      });
    },
};