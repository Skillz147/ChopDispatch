// src/screens/StoreProductsModal.js
import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CartContext } from "../../context/CartContext";
import styles from "../../styles/StoreProductsModalStyles";
import colors from "../../styles/colors";
import { getIcon } from "../../utils/iconMappings";

// Constants
const { height: windowHeight } = Dimensions.get("window");
const EXCLUDED_KEYS = new Set(["id", "name", "image", "description", "available", "discount"]);

const StoreProductsModal = ({ visible, store, onClose }) => {
  const [cartSheetVisible, setCartSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});

  const bounceValue = useRef(new Animated.Value(windowHeight * 0.8)).current; // Start off-screen
  const { addToCart, toggleFavorite, favorites } = useContext(CartContext);

  // Animation Effect
  useEffect(() => {
    Animated.timing(bounceValue, {
      toValue: cartSheetVisible ? 0 : windowHeight * 0.8, // Slide up to 0, down to off-screen
      duration: 300, // 300ms for a smooth, standard animation
      useNativeDriver: true,
    }).start();
  }, [cartSheetVisible, bounceValue]);

  const handleProductPress = (product) => {
    if (!product || typeof product !== "object") {
      console.error("Invalid product:", product);
      return;
    }
    setSelectedProduct(product);
    setCartSheetVisible(true);
    setSelectedItems({});
  };

  const handleCloseCartSheet = () => {
    setCartSheetVisible(false);
    setSelectedProduct(null);
    setSelectedItems({});
  };

  const formatPrice = (price) => {
    if (typeof price !== "number") return "₦0";
    return `₦${price.toLocaleString("en-NG")}`;
  };

  const calculateTotalPrice = () => {
    return Object.values(selectedItems)
      .flat()
      .reduce((sum, item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return sum + price * quantity;
      }, 0);
  };

  const addItem = (category, item) => {
    if (!item || !item.name || typeof item.price !== "number") {
      console.error("Invalid item:", item);
      return;
    }
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const existing = categoryItems.find((i) => i.name === item.name);
      if (existing) {
        return {
          ...prev,
          [category]: categoryItems.map((i) =>
            i.name === item.name ? { ...i, quantity: (i.quantity || 1) + 1 } : i
          ),
        };
      }
      return {
        ...prev,
        [category]: [...categoryItems, { ...item, quantity: 1 }],
      };
    });
  };

  const removeItem = (category, item) => {
    if (!item || !item.name) {
      console.error("Invalid item to remove:", item);
      return;
    }
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const existing = categoryItems.find((i) => i.name === item.name);
      if (!existing) return prev;
      if (existing.quantity > 1) {
        return {
          ...prev,
          [category]: categoryItems.map((i) =>
            i.name === item.name ? { ...i, quantity: i.quantity - 1 } : i
          ),
        };
      }
      const updatedItems = categoryItems.filter((i) => i.name !== item.name);
      return updatedItems.length > 0 ? { ...prev, [category]: updatedItems } : { ...prev, [category]: [] };
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item)}>
      <Image source={{ uri: item.image || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || "Unnamed Product"}</Text>
        <Text style={styles.productDescription}>{item.description || "No description available"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAddOnOptions = (options, category, label, subcategoryKey) => {
    if (!Array.isArray(options) || options.length === 0) return null;

    const iconName = getIcon("subcategories", subcategoryKey);

    return (
      <View key={subcategoryKey} style={styles.addOnContainer}>
        <View style={styles.addOnHeader}>
          <Icon name={iconName} size={20} color={colors.flagship} style={styles.addOnIcon} />
          <Text style={styles.addOnLabel}>{label}</Text>
        </View>
        {options.map((option) => {
          const selectedItem = (selectedItems[category] || []).find((item) => item.name === option.name);
          const quantity = selectedItem ? selectedItem.quantity : 0;
          return (
            <View key={option.name} style={styles.addOnOption}>
              <Text style={styles.addOnText}>
                {option.name} ({formatPrice(option.price)})
              </Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => removeItem(category, option)}
                  disabled={quantity === 0}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => addItem(category, option)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderCartSheet = () => {
    if (!selectedProduct) return null;

    const isFavorite = favorites.some((fav) => fav.id === selectedProduct.id);
    const totalPrice = calculateTotalPrice();

    const handleAddToCart = () => {
      if (Object.keys(selectedItems).length === 0) {
        console.warn("No items selected for cart");
        return;
      }
      addToCart(
        {
          ...selectedProduct,
          selectedItems,
          totalPrice,
        },
        store // Pass the store object directly
      );
      handleCloseCartSheet();
    };

    const handleToggleFavorite = () => toggleFavorite(selectedProduct);

    return (
      <Animated.View
        style={[
          styles.cartSheetContainer,
          {
            transform: [
              {
                translateY: bounceValue, // Directly use bounceValue without interpolation
              },
            ],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.cartProductName}>{selectedProduct.name || "Unnamed Product"}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseCartSheet}>
            <Icon name="close" size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.cartSheetContent}>
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={{ uri: selectedProduct.image || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }}
              style={styles.cartProductImage}
            />
          </TouchableOpacity>
          <Text style={styles.productDescription}>
            {selectedProduct.description || "No description available"}
          </Text>

          {Object.entries(selectedProduct)
            .filter(([key]) => !EXCLUDED_KEYS.has(key) && Array.isArray(selectedProduct[key]) && selectedProduct[key].length > 0)
            .map(([key, options]) => {
              const label = key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
              return renderAddOnOptions(options, key, label, key);
            })}

          <View style={styles.quantityAndFavoriteContainer}>
            <TouchableOpacity style={styles.favoriteButton} onPress={handleToggleFavorite}>
              <Icon
                name={isFavorite ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite ? colors.primary : colors.textDark}
              />
              <Text style={styles.favoriteText}>{isFavorite ? "Remove" : "Add"}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.totalPriceText}>Total: {formatPrice(totalPrice)}</Text>
          <TouchableOpacity
            style={[styles.addToCartButton, totalPrice === 0 && styles.disabledButton]}
            onPress={handleAddToCart}
            disabled={totalPrice === 0}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <TouchableOpacity style={styles.imageModalOverlay} onPress={() => setImageModalVisible(false)}>
            <Image
              source={{ uri: selectedProduct?.image || "https://ipfs.phonetor.com/ipfs/QmSEuVP5cFmrzRwX55eqPbtt5MAs1TV1dVcef2fwo1gkeJ" }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Modal>
      </Animated.View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {cartSheetVisible ? (
            renderCartSheet()
          ) : (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalStoreName}>{store?.name || "Unnamed Store"}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={store?.products || []}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.id || Math.random().toString(36).substr(2)}
                contentContainerStyle={styles.productsContainer}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default StoreProductsModal;