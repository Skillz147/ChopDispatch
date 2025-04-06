// src/styles/HistoryWidgetStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Start from bottom
  },
  upperOverlay: {
    flex: 1, // Takes up remaining space above container
  },
  container: {
    width: width,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.9, // Cap at 70%
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.textLight,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.textDark,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: `${colors.textLight}20`,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  headerIcon: {
    marginRight: 5,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}20`,
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellIcon: {
    marginRight: 5,
  },
  cellText: {
    fontSize: 14,
    color: colors.textDark,
  },
  noHistory: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 20,
  },
});