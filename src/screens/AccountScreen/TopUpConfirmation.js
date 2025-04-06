// src/screens/AccountScreen/TopUpConfirmation.js
import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import successAnimation from '../../../assets/lottie/success.json';
import failureAnimation from '../../../assets/lottie/failure.json';
import styles from '../../styles/TopUpConfirmationStyles';
import colors from '../../styles/colors';
import { formatNaira } from '../../utils/formatCurrency';

const TopUpConfirmation = ({ paymentResponse, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const titleScaleAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef(null);

  useEffect(() => {
    const playSound = async () => {
      try {
        const soundFile =
          paymentResponse?.status === 'success'
            ? require('../../../assets/sounds/success.mp3')
            : require('../../../assets/sounds/failure.mp3');
        const { sound } = await Audio.Sound.createAsync(soundFile, { shouldPlay: true, volume: 0.5 });
        soundRef.current = sound;
        return () => {
          if (soundRef.current) soundRef.current.unloadAsync();
        };
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    };

    if (paymentResponse) {
      playSound();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(titleScaleAnim, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(titleScaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch((err) => console.error('Unload error:', err));
      }
    };
  }, [paymentResponse]);

  if (!paymentResponse) return null;

  return (
    <Modal transparent animationType="none" visible={!!paymentResponse}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={{ transform: [{ scale: titleScaleAnim }] }}>
            <Text style={styles.title}>
              {paymentResponse.status === 'success' ? 'Top Up Successful!' : 'Top Up Failed'}
            </Text>
          </Animated.View>
          <View style={styles.body}>
            {paymentResponse.status === 'success' ? (
              <>
                <LottieView source={successAnimation} autoPlay loop={false} style={styles.animation} />

                <View style={styles.confirmRow}>
                  <Icon name="cash" size={20} color={colors.textDark} style={styles.icon} />
                  <Text style={styles.text}>Amount: {formatNaira(paymentResponse.amount)}</Text>
                </View>
              </>
            ) : (
              <>
                <LottieView source={failureAnimation} autoPlay loop={false} style={styles.animation} />
                <View style={styles.confirmRow}>
                  <Icon name="receipt" size={20} color={colors.textDark} style={styles.icon} />
                  <Text style={styles.text}>Transaction ID: {paymentResponse.txRef}</Text>
                </View>
                <View style={styles.confirmRow}>
                  <Icon name="alert" size={20} color={colors.textDark} style={styles.icon} />
                  <Text style={styles.text}>Reason: {paymentResponse.reason || 'Payment failed'}</Text>
                </View>
              </>
            )}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <View style={styles.buttonContent}>
              <Icon name="close" size={20} color={colors.surface} style={styles.closeIcon} />
              <Text style={styles.closeButtonText}>Close</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TopUpConfirmation;