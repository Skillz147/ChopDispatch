import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity, Text, Animated, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/LocationStyles";
import colors from "../../styles/colors";

const Locations = React.memo(({ locations, onSelectLocation, selectedLocation }) => {
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    if (!locations || !Array.isArray(locations)) return;
    const newAnimatedValues = locations.reduce((acc, item) => {
      if (!acc[item.id]) {
        acc[item.id] = new Animated.Value(selectedLocation === item.name ? 1 : 0);
      }
      return acc;
    }, { ...animatedValues });
    setAnimatedValues(newAnimatedValues);
  }, [locations, selectedLocation]);

  const handleLocationPress = (location) => {
    onSelectLocation(location.name);
    Animated.parallel(
      locations.map((item) =>
        Animated.spring(animatedValues[item.id], {
          toValue: item.name === location.name ? 1 : 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const getBackgroundColor = (icon, isActive) => {
    if (!isActive) return colors.surface; // Inactive uses surface color
    switch (icon) {
      case "earth": return "#FFFACD"; // Lavender for "All Stores"
      case "city": return "#FFFACD"; // Thistle for cities
      case "map": return "#FFFACD"; // Lemon Chiffon for states
      default: return "#B0E0E6"; // Powder Blue as fallback
    }
  };

  const renderItem = ({ item }) => {
    const isActive = selectedLocation === item.name;
    const scale = animatedValues[item.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.03],
    }) || 1;
    const elevation = animatedValues[item.id]?.interpolate({
      inputRange: [0, 1],
      outputRange: [4, 6],
    }) || 4;

    return (
      <TouchableOpacity
        style={styles.locationCardWrapper}
        onPress={() => handleLocationPress(item)}
        activeOpacity={0.85}
        accessibilityLabel={`Select location: ${item.name}`}
        accessibilityHint={isActive ? "Currently selected location" : "Tap to select this location"}
      >
        <Animated.View
          style={[
            styles.locationCard,
            {
              transform: [{ scale }],
              elevation,
              backgroundColor: getBackgroundColor(item.icon, isActive),
              borderColor: isActive ? colors.primary : `${colors.textLight}30`,
            },
          ]}
        >
          <View style={styles.locationRow}>
            <Icon
              name={item.icon}
              size={20}
              color={isActive ? colors.primary : colors.textDark}
              style={styles.locationIcon}
            />
            <Text
              style={[styles.locationText, isActive && styles.locationTextActive]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={locations}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.locationsContainer}
      renderItem={renderItem}
    />
  );
});

export default Locations;