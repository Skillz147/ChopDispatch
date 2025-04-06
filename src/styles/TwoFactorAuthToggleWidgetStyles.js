// src/styles/TwoFactorAuthToggleWidgetStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: colors.textDark,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Start at the bottom
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Ensure sheet stays at bottom until keyboard lifts
  },
  sheetContainer: {
    width: width,
    height: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  qrCode: {
    marginBottom: 20,
  },
  manualCodeContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  manualCodeLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 5,
  },
  manualCode: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 20,
    width: '80%',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10, // Add padding to frame the button
  },
  actionButton: {
    borderRadius: 8,
    width: '80%',
  },
  disabledButton: {
    opacity: 0.8,
  },
  gradientButton: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});