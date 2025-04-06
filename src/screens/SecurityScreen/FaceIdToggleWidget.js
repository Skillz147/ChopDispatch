// src/screens/SecurityScreen/FaceIdToggleWidget.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { securityService } from '../../services/securityService';
import styles from '../../styles/FaceIdToggleWidgetStyles';
import colors from '../../styles/colors';

let FaceDetector;
try {
  FaceDetector = require('expo-face-detector');
} catch (e) {
  console.log('FaceDetector not available in this environment'); // Silent log, no LogBox
}

export const FaceIdToggleWidget = ({ user, onFaceIdStatusChange }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [action, setAction] = useState('enable'); // 'enable' or 'disable'

  useEffect(() => {
    if (user?.uid) {
      console.log('Checking Face ID status for UID:', user.uid);
      securityService.getFaceIdStatus(user.uid).then((enabled) => {
        setIsEnabled(enabled);
        console.log('Initial Face ID status:', enabled);
      }).catch((error) => {
        setErrorMessage('Failed to load Face ID status');
        console.log('Error checking Face ID status:', error.message); // Silent log
      });
    }
  }, [user]);

  const handleToggle = (value) => {
    if (!user || !user.uid) {
      Toast.show({ type: 'error', text1: 'User Error', text2: 'No user data available' });
      setErrorMessage('No user data available');
      return;
    }
    setAction(value ? 'enable' : 'disable');
    setModalVisible(true);
    setErrorMessage('');
  };

  const handleEnableFaceId = async () => {
    console.log('Attempting to enable Face ID for UID:', user.uid);

    if (!FaceDetector) {
      const errorText = 'Face ID is not supported in this app version. Please use a custom build.';
      Toast.show({ type: 'error', text1: 'Face ID Unavailable', text2: errorText });
      setErrorMessage(errorText);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Starting Face ID registration');
      const result = await FaceDetector.detectFacesAsync({
        mode: FaceDetector.Modes.fast,
        detectLandmarks: FaceDetector.Landmarks.all,
        runClassifications: FaceDetector.Classifications.all,
      });
      if (!result.faces.length) {
        throw new Error('No face detected');
      }
      console.log('Face ID registered successfully:', result.faces[0]);
      await securityService.setFaceId(user.uid, true);
      console.log('Face ID enabled in storage');
      Toast.show({ type: 'success', text1: 'Face ID Enabled', text2: 'Your face has been registered' });
      setIsEnabled(true);
      onFaceIdStatusChange(true);
      setModalVisible(false);
    } catch (error) {
      console.log('Error enabling Face ID:', error.message); // Silent log
      const errorText = error.message === 'No face detected'
        ? 'No face detected. Position your face in the camera and try again.'
        : 'Failed to enable Face ID. Check your device settings or try again.';
      Toast.show({ type: 'error', text1: 'Face ID Error', text2: errorText });
      setErrorMessage(errorText);
      setIsEnabled(false); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  const handleDisableFaceId = async () => {
    console.log('Handling Face ID disable for UID:', user.uid);

    setLoading(true);
    setErrorMessage('');
    try {
      console.log('Disabling Face ID');
      await securityService.setFaceId(user.uid, false);
      console.log('Face ID disabled successfully');
      Toast.show({ type: 'success', text1: 'Face ID Disabled', text2: 'Face ID has been turned off' });
      setIsEnabled(false);
      onFaceIdStatusChange(false);
      setModalVisible(false);
    } catch (error) {
      console.log('Error disabling Face ID:', error.message); // Silent log
      const errorText = 'Failed to disable Face ID. Please try again.';
      Toast.show({ type: 'error', text1: 'Face ID Disable Failed', text2: errorText });
      setErrorMessage(errorText);
      setIsEnabled(true); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.optionContainer}>
        <Ionicons name="lock-closed-outline" size={24} color={colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>Face ID</Text>
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
                  <Text style={styles.title}>{action === 'enable' ? 'Enable Face ID' : 'Disable Face ID'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={colors.textDark} />
                  </TouchableOpacity>
                </View>
                <Ionicons
                  name="person-circle-outline"
                  size={80}
                  color={loading ? colors.primary : colors.textLight}
                  style={styles.faceIcon}
                />
                <Text style={styles.messageText}>
                  {action === 'enable'
                    ? loading
                      ? 'Scanning your face...'
                      : 'Position your face in front of the camera to register.'
                    : 'Are you sure you want to disable Face ID?'}
                </Text>
                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    loading && styles.disabledButton,
                    action === 'disable' && !loading && styles.disableButton,
                  ]}
                  onPress={action === 'enable' ? handleEnableFaceId : handleDisableFaceId}
                  disabled={loading}
                >
                  <Text style={styles.actionButtonText}>
                    {action === 'enable' ? (loading ? 'Scanning...' : 'Scan Face') : (loading ? 'Disabling...' : 'Disable')}
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