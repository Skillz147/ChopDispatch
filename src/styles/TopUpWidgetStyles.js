// src/styles/TopUpWidgetStyles.js
import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  keyboardAvoidingContainer: {
    width: '100%',
  },
  container: {
    backgroundColor: colors.surface,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: '100%',
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
    paddingBottom: 20,
  },
  paymentContainer: {
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: `${colors.textLight}50`,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 10,
  },
  predefinedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  predefinedButton: {
    width: '30%', // 3 buttons per row
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
  confirmButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: `${colors.primary}80`,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 8,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 20,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 20,
  },
  agreementContainer: {
    paddingBottom: 20,
  },
  agreementCard: {
    backgroundColor: `${colors.surface}F0`, // Slightly translucent
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: `${colors.textLight}30`,
  },
  agreementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  agreementIcon: {
    marginRight: 10,
  },
  agreementText: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  termsLink: {
    alignItems: 'center',
  },
  termsLinkText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
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
});