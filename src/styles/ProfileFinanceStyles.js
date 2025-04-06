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
  loading: {
    marginVertical: 20,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: `${colors.textLight}30`,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
    width: 120, // Fixed width for alignment
  },
  value: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  copyButton: {
    padding: 8,
  },
  noAccountContainer: {
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 16,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: colors.surface,
    fontWeight: '600',
  },
});