// src/styles/TopUpConfirmationStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for emphasis
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width,
    height: height,
    backgroundColor: colors.surface,
    padding: 20,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  title: {
    fontSize: 28, // Larger for full-screen impact
    fontWeight: '700',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  body: {
    alignItems: 'center',
    flexGrow: 0, // Prevent stretching
  },
  animation: {
    width: 200, // Larger animation for full-screen
    height: 200,
    marginBottom: 30,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18, // Slightly larger text
    color: colors.textDark,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40, // Wider button
    borderRadius: 8,
    marginTop: 40,
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeIcon: {
    marginRight: 8,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.surface,
  },
});