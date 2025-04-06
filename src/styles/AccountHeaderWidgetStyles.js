// src/styles/AccountHeaderWidgetStyles.js
import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const { width } = Dimensions.get('window');

export default StyleSheet.create({
  headerContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: width - 30,
    alignSelf: 'center',
  },
  userInfoContainer: {
    alignItems: 'flex-start',
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular
    marginRight: 10,
    backgroundColor: `${colors.textLight}20`, // Fallback background if image fails
  },
  profileIcon: {
    marginRight: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textDark,
    flex: 1,
  },
  verifiedIcon: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  roleText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
});