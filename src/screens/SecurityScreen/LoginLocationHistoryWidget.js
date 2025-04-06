// src/screens/SecurityScreen/LoginLocationHistoryWidget.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { securityService } from '../../services/securityService';
import * as Device from 'expo-device';
import { Linking } from 'react-native';
import styles from '../../styles/LoginLocationHistoryWidgetStyles';
import colors from '../../styles/colors';

export const LoginLocationHistoryWidget = ({ user }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [currentDevice, setCurrentDevice] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) return;

    const initializeLoginData = async () => {
      try {
        const history = await securityService.getLoginLocationHistory(user.uid);
        if (history.length === 0) {
          await securityService.logLoginLocation(user.uid);
        }
        const enrichedHistory = await Promise.all(
          history.slice(-10).reverse().map(async (entry) => {
            const location = await reverseGeocode(entry.latitude, entry.longitude);
            return { ...entry, location };
          })
        );
        setLoginHistory(enrichedHistory);

        const deviceInfo = {
          modelName: Device.modelName || 'Unknown Model',
        };
        setCurrentDevice(deviceInfo);
      } catch (error) {
        console.error('Error initializing login data:', error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load login history' });
      }
    };

    initializeLoginData();

    const unsubscribe = securityService.listenLoginLocationUpdates(user.uid, async (updatedHistory) => {
      const enrichedHistory = await Promise.all(
        updatedHistory.slice(-10).reverse().map(async (entry) => {
          const location = await reverseGeocode(entry.latitude, entry.longitude);
          return { ...entry, location };
        })
      );
      setLoginHistory(enrichedHistory);
      checkForNewDevice(updatedHistory);
    });

    return () => unsubscribe();
  }, [user]);

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village || 'Unknown City';
      const state = data.address.state || 'Unknown State';
      return `${city}, ${state}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`; // Fallback
    }
  };

  const checkForNewDevice = (history) => {
    if (!currentDevice || history.length <= 1) return;

    const latestLogin = history[history.length - 1];
    const deviceMatch = latestLogin.device.modelName === currentDevice.modelName;

    if (!deviceMatch) {
      Toast.show({
        type: 'warning',
        text1: 'New Device Detected',
        text2: `Login from ${latestLogin.device.modelName}`,
      });
    }
  };

  const openLocationInMap = (latitude, longitude) => {
    const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
    Linking.openURL(url).catch((err) => {
      console.error('Error opening map:', err);
      Toast.show({ type: 'error', text1: 'Map Error', text2: 'Failed to open location' });
    });
  };

  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <View style={styles.headerCell}>
        <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerText}>Device</Text>
      </View>
      <View style={styles.headerCell}>
        <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerText}>Location</Text>
      </View>
      <View style={styles.headerCell}>
        <Ionicons name="calendar-outline" size={20} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.headerText}>Last Login</Text>
      </View>
    </View>
  );

  const renderLoginItem = ({ item }) => (
    <TouchableOpacity
      style={styles.loginItem}
      onPress={() => openLocationInMap(item.latitude, item.longitude)}
    >
      <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.itemIcon} />
      <Text style={styles.itemText}>{item.device.modelName}</Text>
      <Text style={styles.itemText}>{item.location}</Text>
      <Text style={styles.itemText}>{new Date(item.timestamp).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity style={styles.optionContainer} onPress={() => setModalVisible(true)}>
        <Ionicons name="earth-outline" size={24} color={colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>Login Location History</Text>
        <Ionicons name="chevron-forward" size={24} color={colors.textLight} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.upperOverlay} onPress={() => setModalVisible(false)} />
          <View style={styles.sheetContainer}>
            <View style={styles.header}>
              <Ionicons name="earth-outline" size={24} color={colors.primary} style={styles.headerIcon} />
              <Text style={styles.title}>Login Location History</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textDark} />
              </TouchableOpacity>
            </View>
            {renderHeader()}
            <FlatList
              data={loginHistory}
              renderItem={renderLoginItem}
              keyExtractor={(item, index) => `${item.timestamp}-${index}`}
              ListEmptyComponent={<Text style={styles.emptyText}>No login history available</Text>}
              style={styles.list}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};