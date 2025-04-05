import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated, Image } from "react-native";
import styles from "../../styles/CategoriesStyles";
import colors from "../../styles/colors";

// Map categories to their respective PNG images and softer colors
const categories = [
  { id: "1", name: "Restaurants", image: require("../../../assets/category/restaurant.png"), color: "#FFB6C1" }, 
  { id: "2", name: "Groceries", image: require("../../../assets/category/grocery.png"), color: "#DEE996" }, 
  { id: "3", name: "Pharmacy", image: require("../../../assets/category/drugstore.png"), color: "#B0E0E6" }, 
  { id: "4", name: "Local Market", image: require("../../../assets/category/food.png"), color: "#FFFACD" }, 
  { id: "5", name: "Mall", image: require("../../../assets/category/shopping-mall.png"), color: "#D8BFD8" }, 
  { id: "6", name: "Fashion", image: require("../../../assets/category/brand.png"), color: "#FFD1DC" }, 
  { id: "7", name: "Wine", image: require("../../../assets/category/wine.png"), color: "#E6E6FA" }, 
  { id: "8", name: "Liquor", image: require("../../../assets/category/liquor.png"), color: "#AFEEEE" }, 
];

const Categories = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [animatedValues] = useState(
    categories.reduce((acc, item) => {
      acc[item.id] = new Animated.Value(0);
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
          friction: 8,
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
      outputRange: [4, 8], // Higher elevation when active
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
              backgroundColor: item.color, // Unique background color for each category
              borderColor: item.color, // Match border color to background
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.image}
              style={styles.categoryImage}
              resizeMode="contain"
            />
          </View>
          <Text
            style={[
              styles.categoryText,
              isActive && styles.categoryTextActive,
            ]}
            numberOfLines={2}
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