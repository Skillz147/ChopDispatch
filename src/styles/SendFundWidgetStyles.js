// src/styles/SendFundWidgetStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  upperOverlay: {
    flex: 1,
  },
  keyboardAvoidingContainer: {
    width: '100%',
  },
  container: {
    width: width,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
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
    color: colors.textDark,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: colors.textDark,
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 20,
  },
  recipientName: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 20,
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  predefinedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  predefinedButton: {
    width: '30%',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.textLight,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  predefinedButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}20`,
  },
  predefinedText: {
    fontSize: 14,
    color: colors.textDark,
  },
  predefinedTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  amountPreviewContainer: {
    marginBottom: 20,
  },
  amountPreview: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'right',
  },
  amountWords: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  authContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  authIcon: {
    marginBottom: 20,
  },
  authText: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  authButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  cancelAuthButton: {
    marginTop: 10,
  },
  cancelAuthButtonText: {
    fontSize: 14,
    color: colors.error,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.8,
  },
  agreementContainer: {
    paddingBottom: 20,
  },
  agreementText: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  agreementButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  agreeButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 5,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.error,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  sendingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  sendingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 20,
  },
  sendingIcon: {
    marginBottom: 10,
  },
  authErrorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  authErrorIcon: {
    marginBottom: 20,
  },
  authErrorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeErrorButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeErrorButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});