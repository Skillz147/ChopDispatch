import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/CategoriesStyles";
import colors from "../../styles/colors";

// Categories updated based on JSON data
const categories = [
  { id: "1", name: "Restaurants", icon: "silverware-fork-knife" },
  { id: "2", name: "Groceries", icon: "cart-outline" },
  { id: "3", name: "Pharmacy", icon: "pill" },
  { id: "4", name: "Local Market", icon: "storefront-outline" },
  { id: "5", name: "Mall", icon: "shopping-outline" },
  { id: "6", name: "Fashion", icon: "hanger" },
];

const Categories = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [animatedValues] = useState(
    categories.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(0); // Animation value for each category
      return acc;
    }, {})
  );

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.name);

    // Animate the selected category
    Animated.parallel(
      categories.map((item) =>
        Animated.spring(animatedValues[item.id], {
          toValue: item.name === category.name ? 1 : 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        })
      )
    ).start();
  };

  const renderItem = ({ item }) => {
    const isActive = selectedCategory === item.name;
    const scale = animatedValues[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.03], // Subtle scale-up when active
    });
    const elevation = animatedValues[item.id].interpolate({
      inputRange: [0, 1],
      outputRange: [4, 6], // Higher elevation when active
    });

    return (
      <TouchableOpacity
        style={styles.categoryCardWrapper}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.85}
      >
        <Animated.View
          style={[
            styles.categoryCard,
            {
              transform: [{ scale }],
              elevation,
              backgroundColor: isActive ? `${colors.primary}10` : colors.surface, // Light tint when active
              borderColor: isActive ? colors.primary : `${colors.textLight}30`, // Border change
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Icon
              name={item.icon}
              size={28} // Larger icon for card feel
              color={isActive ? colors.primary : colors.textDark}
            />
          </View>
          <Text
            style={[
              styles.categoryText,
              isActive && styles.categoryTextActive,
            ]}
            numberOfLines={2} // Allow wrapping for longer names
          >
            {item.name}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={categories}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.categoriesContainer}
      renderItem={renderItem}
    />
  );
};

export default Categories;