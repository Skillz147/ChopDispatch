// src/screens/SecurityScreen.js (unchanged from last version)
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LoginLocationHistoryWidget } from './SecurityScreen/LoginLocationHistoryWidget';
import { PinSetupWidget } from './SecurityScreen/PinSetupWidget';
import { FaceIdToggleWidget } from './SecurityScreen/FaceIdToggleWidget';
import { TwoFactorAuthToggleWidget } from './SecurityScreen/TwoFactorAuthToggleWidget';
import { ChangePasswordWidget } from './SecurityScreen/ChangePasswordWidget';
import { securityService } from '../services/securityService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/SecurityScreenStyles';
import colors from '../styles/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SecurityScreen = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [hasFaceId, setHasFaceId] = useState(false);
  const [has2FA, setHas2FA] = useState(false);

  const loadSecurityStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [pin, faceId, twoFA] = await Promise.all([
        securityService.hasPin(user.uid),
        securityService.getFaceIdStatus(user.uid),
        securityService.getTwoFactorAuthStatus(user.uid),
      ]);
      setHasPin(pin);
      setHasFaceId(faceId);
      setHas2FA(twoFA);
    } catch (error) {
      console.error('Error loading security settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await AsyncStorage.multiRemove([
        `pin_${user.uid}`,
        `faceId_${user.uid}`,
        `2fa_${user.uid}`,
        `loginHistory_${user.uid}`,
      ]);
      await loadSecurityStatus();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh security settings.');
    }
    setRefreshing(false);
  }, [user]);

  useEffect(() => {
    loadSecurityStatus();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No user logged in</Text>
      </View>
    );
  }

  const data = [
    { key: 'header', component: (
      <View style={styles.header}>
        <Icon name="security" size={28} color={colors.primary} style={styles.headerIcon} />
        <Text style={styles.title}>Security Settings</Text>
      </View>
    )},
    { key: 'loginHistory', component: <LoginLocationHistoryWidget user={user} /> },
    { key: 'pinSetup', component: <PinSetupWidget user={user} onPinStatusChange={setHasPin} /> },
    { key: 'faceId', component: <FaceIdToggleWidget user={user} onFaceIdStatusChange={setHasFaceId} /> },
    { key: 'twoFactor', component: <TwoFactorAuthToggleWidget user={user} onTwoFactorStatusChange={setHas2FA} /> },
    { key: 'changePassword', component: <ChangePasswordWidget user={user} /> },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.component}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContainer}
      />
    </View>
  );
};

export default SecurityScreen;