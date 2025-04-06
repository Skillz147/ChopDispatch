// src/screens/AccountScreen/HistoryWidget.js
import React, { useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/HistoryWidgetStyles';
import colors from '../../styles/colors';
import { formatNaira } from '../../utils/formatCurrency';

const { height } = Dimensions.get('window');
const MAX_HEIGHT = height * 0.7; // 70% of screen height

export const HistoryWidget = ({ visible, onClose, topUpHistory, sendHistory }) => {
  const [filter, setFilter] = useState('All');

  // Combine topUpHistory (includes top_up and receive) and sendHistory
  const combinedHistory = [
    ...(topUpHistory || []).map((item) => ({ ...item, source: 'topUpHistory' })),
    ...(sendHistory || []).map((item) => ({ ...item, source: 'sendHistory' })),
  ];

  // Sort combined history by date (latest first) and apply filter
  const filteredHistory = combinedHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((item) => filter === 'All' || item.status === filter.toLowerCase());

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerCell}>
        <Ionicons name="calendar-outline" size={18} color={colors.textDark} style={styles.headerIcon} />
        <Text style={styles.headerText}>Date</Text>
      </View>
      <View style={styles.headerCell}>
        <Ionicons name="checkmark-circle-outline" size={18} color={colors.textDark} style={styles.headerIcon} />
        <Text style={styles.headerText}>Status</Text>
      </View>
      <View style={styles.headerCell}>
        <Ionicons name="cash-outline" size={18} color={colors.textDark} style={styles.headerIcon} />
        <Text style={styles.headerText}>Amount</Text>
      </View>
      <View style={styles.headerCell}>
        <Ionicons name="swap-vertical-outline" size={18} color={colors.textDark} style={styles.headerIcon} />
        <Text style={styles.headerText}>Type</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.cell}>
        <Ionicons name="calendar-outline" size={16} color={colors.primary} style={styles.cellIcon} />
        <Text style={styles.cellText}>
          {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })}
        </Text>
      </View>
      <View style={styles.cell}>
        <Ionicons
          name={item.status === 'success' ? 'checkmark-circle' : 'close-circle'}
          size={16}
          color={item.status === 'success' ? colors.badge : colors.error}
          style={styles.cellIcon}
        />
        <Text style={[styles.cellText, { color: item.status === 'success' ? colors.badge : colors.error }]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <View style={styles.cell}>
        <Ionicons name="cash-outline" size={16} color={colors.primary} style={styles.cellIcon} />
        <Text style={styles.cellText}>{formatNaira(item.amount)}</Text>
      </View>
      <View style={styles.cell}>
        <Ionicons name="swap-vertical-outline" size={16} color={colors.primary} style={styles.cellIcon} />
        <Text style={styles.cellText}>
          {item.type === 'top_up' ? 'Top Up' : item.type === 'receive' ? 'Receive' : 'Send'}
        </Text>
      </View>
    </View>
  );

  const headerHeight = 100; // Approximate height of header (title + icon + padding)
  const filterHeight = 60; // Approximate height of filter bar
  const itemHeight = 50; // Approximate height of each history item
  const emptyHeight = 80; // Height of "no history" message
  const contentHeight = filteredHistory.length === 0
    ? headerHeight + filterHeight + emptyHeight
    : headerHeight + filterHeight + filteredHistory.length * itemHeight;
  const containerHeight = Math.min(contentHeight, MAX_HEIGHT);

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.upperOverlay} onPress={onClose} />
        <View style={[styles.container, { height: containerHeight }]}>
          <View style={styles.header}>
            <Ionicons name="time-outline" size={24} color={colors.textDark} style={styles.headerIcon} />
            <Text style={styles.title}>Transaction History</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.textDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'All' && styles.filterButtonActive]}
              onPress={() => setFilter('All')}
            >
              <Text style={[styles.filterText, filter === 'All' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'Success' && styles.filterButtonActive]}
              onPress={() => setFilter('Success')}
            >
              <Text style={[styles.filterText, filter === 'Success' && styles.filterTextActive]}>Success</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filter === 'Failed' && styles.filterButtonActive]}
              onPress={() => setFilter('Failed')}
            >
              <Text style={[styles.filterText, filter === 'Failed' && styles.filterTextActive]}>Failed</Text>
            </TouchableOpacity>
          </View>
          {filteredHistory.length === 0 ? (
            <Text style={styles.noHistory}>No transactions match your filter.</Text>
          ) : (
            <FlatList
              data={filteredHistory}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.txRef}-${index}`}
              ListHeaderComponent={renderHeader}
              style={styles.historyList}
              contentContainerStyle={{ flexGrow: contentHeight > MAX_HEIGHT ? 0 : 1 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};