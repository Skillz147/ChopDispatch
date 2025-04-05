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
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { CartContext } from "../../context/CartContext";
import styles from "../../styles/StoreProductsModalStyles";
import colors from "../../styles/colors";
import { getIcon } from "../../utils/iconMappings";

// Constants
const { height: windowHeight } = Dimensions.get("window");
const EXCLUDED_KEYS = new Set(["id", "name", "image", "description", "available", "discount"]);
const MAX_QUANTITY = 10; // Maximum quantity per add-on

const StoreProductsModal = ({ visible, store, onClose }) => {
  const [cartSheetVisible, setCartSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [fadeAnim] = useState(new Animated.Value(0)); // For fade-in animation

  const bounceValue = useRef(new Animated.Value(windowHeight * 0.8)).current;
  const { addToCart, toggleFavorite, favorites } = useContext(CartContext);

  // Animation Effects
  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  useEffect(() => {
    Animated.timing(bounceValue, {
      toValue: cartSheetVisible ? 0 : windowHeight * 0.8,
      duration: 300,
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

  // Function to check if a store is open based on current day and time
  const isStoreOpen = (hours) => {
    if (!hours || typeof hours !== "object") return false;

    const now = new Date();
    const day = now.toLocaleString("en-US", { weekday: "long" }); // e.g., "Monday"
    const todayHours = hours[day];
    if (!todayHours) return false; // Closed if no hours for today

    const [openTime, closeTime] = todayHours.split("-");
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);
    const openTimeInMinutes = openHour * 60 + openMinute;
    const closeTimeInMinutes = closeHour * 60 + closeMinute;

    // Handle overnight hours (e.g., 22:00-06:00)
    if (closeTimeInMinutes < openTimeInMinutes) {
      return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
    }
    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
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
    if (!isStoreOpen(store.hours)) return; // Prevent adding items if store is closed
    if (!item || !item.name || typeof item.price !== "number") {
      console.error("Invalid item:", item);
      return;
    }
    setSelectedItems((prev) => {
      const categoryItems = prev[category] || [];
      const existing = categoryItems.find((i) => i.name === item.name);
      if (existing) {
        if (existing.quantity >= MAX_QUANTITY) {
          return prev; // Prevent adding more than max quantity
        }
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
    if (!isStoreOpen(store.hours)) return; // Prevent removing items if store is closed
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
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => handleProductPress(item)}
      accessibilityLabel={`Select product: ${item.name || "Unnamed Product"}`}
      accessibilityHint="Tap to view product details"
    >
      <Image
        source={{ uri: item.image || "https://peach-legislative-albatross-440.mypinata.cloud/ipfs/bafkreih4vb4lnukymgdl2g37xl4ahca6lfb5qof6gtqkq3johqxc3isity" }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || "Unnamed Product"}</Text>
        <Text style={styles.productDescription}>{item.description || "No description available"}</Text>
        {!item.available && (
          <View style={styles.outOfStockBadge}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
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
            <View key={option.name} style={[styles.addOnOption, quantity > 0 && styles.addOnOptionSelected]}>
              <Text style={styles.addOnText}>
                {option.name} ({formatPrice(option.price)})
              </Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity === 0 && styles.quantityButtonDisabled]}
                  onPress={() => removeItem(category, option)}
                  disabled={quantity === 0 || !isStoreOpen(store.hours)}
                  accessibilityLabel={`Remove ${option.name} from selection`}
                  accessibilityHint="Decreases the quantity of this add-on"
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, quantity >= MAX_QUANTITY && styles.quantityButtonDisabled]}
                  onPress={() => addItem(category, option)}
                  disabled={quantity >= MAX_QUANTITY || !isStoreOpen(store.hours)}
                  accessibilityLabel={`Add ${option.name} to selection`}
                  accessibilityHint="Increases the quantity of this add-on"
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
    const isStoreClosed = !isStoreOpen(store.hours);

    const handleAddToCart = () => {
      if (Object.keys(selectedItems).length === 0) {
        Alert.alert("No Items Selected", "Please select at least one add-on to add to cart.");
        return;
      }
      if (isStoreClosed) {
        Alert.alert("Store Closed", "You cannot add items to cart from a closed store.");
        return;
      }
      try {
        addToCart(
          {
            ...selectedProduct,
            selectedItems,
            totalPrice,
          },
          store
        );
        handleCloseCartSheet();
      } catch (error) {
        Alert.alert("Error", "Failed to add item to cart. Please try again.");
        console.error("Error adding to cart:", error);
      }
    };

    const handleToggleFavorite = () => toggleFavorite(selectedProduct);

    return (
      <Animated.View
        style={[
          styles.cartSheetContainer,
          {
            transform: [{ translateY: bounceValue }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.cartProductName}>{selectedProduct.name || "Unnamed Product"}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseCartSheet}
            accessibilityLabel="Close cart sheet"
            accessibilityHint="Closes the product details sheet"
          >
            <Icon name="close" size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.cartSheetContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={{ uri: selectedProduct.image || "https://peach-legislative-albatross-440.mypinata.cloud/ipfs/bafkreih4vb4lnukymgdl2g37xl4ahca6lfb5qof6gtqkq3johqxc3isity" }}
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
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
                accessibilityLabel={isFavorite ? "Remove from favorites" : "Add to favorites"}
                accessibilityHint={isFavorite ? "Removes this product from your favorites" : "Adds this product to your favorites"}
              >
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
              style={[styles.addToCartButton, (totalPrice === 0 || isStoreClosed) && styles.disabledButton]}
              onPress={handleAddToCart}
              disabled={totalPrice === 0 || isStoreClosed}
              accessibilityLabel="Add to cart"
              accessibilityHint="Adds the selected product and add-ons to your cart"
            >
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={imageModalVisible}
          onRequestClose={() => setImageModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.imageModalOverlay}
            onPress={() => setImageModalVisible(false)}
          >
            <Image
              source={{ uri: selectedProduct?.image || "https://peach-legislative-albatross-440.mypinata.cloud/ipfs/bafkreih4vb4lnukymgdl2g37xl4ahca6lfb5qof6gtqkq3johqxc3isity" }}
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
                <Text style={styles.modalStoreName}>
                  {store?.name || "Unnamed Store"}
                </Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={onClose}
                  accessibilityLabel="Close modal"
                  accessibilityHint="Closes the store products modal"
                >
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
              <Animated.View style={[styles.productsContainer, { opacity: fadeAnim }]}>
                <FlatList
                  data={store?.products || []}
                  renderItem={renderProductItem}
                  keyExtractor={(item) => item.id || Math.random().toString(36).substr(2)}
                  contentContainerStyle={styles.productsContainer}
                />
              </Animated.View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(StoreProductsModal);