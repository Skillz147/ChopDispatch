// src/styles/LoginLocationHistoryWidgetStyles.js
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
    justifyContent: 'flex-end',
  },
  upperOverlay: {
    flex: 1,
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
    color: colors.textDark,
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.textLight,
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  loginItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.textLight}20`,
  },
  itemIcon: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
    textAlign: 'left',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
});