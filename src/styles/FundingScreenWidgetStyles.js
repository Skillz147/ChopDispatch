import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: `${colors.textLight}20`,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: `${colors.textLight}30`,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}20`,
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
    width: 120,
  },
  value: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  copyButton: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: `${colors.primary}10`, // Subtle tint
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 12,
    color: colors.textDark,
    marginTop: 4,
    fontWeight: '600',
  },
  webview: {
    height: 500,
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${colors.textLight}20`,
  },
});