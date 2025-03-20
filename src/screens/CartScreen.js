// src/screens/CartScreen.js
import React, { useContext, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native"; // Import LottieView
import { CartContext } from "../context/CartContext";
import CheckoutSheet from "./CheckoutSheet"; // Correct path
import styles from "../styles/CartScreenStyles";
import colors from "../styles/colors";

const CartScreen = () => {
  const { cartItems, adjustQuantity, removeFromCart, loading } = useContext(CartContext);
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "₦0";
    return `₦${price.toLocaleString("en-NG")}`;
  };

  const calculateTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const itemTotal = Number(item.totalPrice) || 0;
      return sum + itemTotal;
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      return;
    }
    if (calculateTotal() <= 0) {
      alert("Cart total is invalid. Please review your items.");
      return;
    }
    setCheckoutVisible(true);
  };

  const renderSubItem = (item, category, selItem) => {
    const key = `${category}-${selItem.name || "unknown"}`;
    const safeName = selItem.name || "Unnamed Item";
    const safePrice = Number(selItem.price) || 0;
    const safeQuantity = Number(selItem.quantity) || 1;

    return (
      <View key={key} style={styles.subItem}>
        <Text style={styles.subItemText}>
          {safeName} ({formatPrice(safePrice)})
        </Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            onPress={() => adjustQuantity(item.id, category, selItem.name, -1)}
            disabled={loading || safeQuantity <= 1}
          >
            <Icon name="minus" size={20} color={loading ? colors.textLight : colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{safeQuantity}</Text>
          <TouchableOpacity
            onPress={() => adjustQuantity(item.id, category, selItem.name, 1)}
            disabled={loading}
          >
            <Icon name="plus" size={20} color={loading ? colors.textLight : colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    if (!item || !item.id || !item.name) {
      console.error("Invalid cart item:", item);
      return null;
    }

    const selectedItems = item.selectedItems || {};
    const hasSubItems = Object.keys(selectedItems).length > 0;

    return (
      <View style={styles.cartItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        {hasSubItems ? (
          <ScrollView style={styles.subItemsContainer}>
            {Object.entries(selectedItems).map(([category, selections]) => {
              if (!Array.isArray(selections)) {
                console.warn(`Invalid selections for category ${category} in item ${item.id}`);
                return null;
              }
              return selections.map((selItem) => renderSubItem(item, category, selItem));
            })}
          </ScrollView>
        ) : (
          <Text style={styles.noSubItemsText}>No customizations</Text>
        )}
        <Text style={styles.itemTotal}>Total: {formatPrice(item.totalPrice)}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
          disabled={loading}
        >
          <Icon name="trash-can-outline" size={24} color={loading ? colors.textLight : colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {(!Array.isArray(cartItems) || cartItems.length === 0) ? (
        <View style={styles.emptyCartContainer}>
          <LottieView
            source={require("../../assets/lottie/emptyCart.json")} // Load noStore.json
            autoPlay
            loop
            style={styles.emptyCartAnimation}
            resizeMode="contain"
            onError={(error) => console.error("Lottie Error:", error)}
          />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id || Math.random().toString(36).substr(2)}
            contentContainerStyle={styles.cartList}
          />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Grand Total: {formatPrice(calculateTotal())}</Text>
            <TouchableOpacity
              style={[styles.checkoutButton, loading && styles.disabledButton]}
              onPress={handleCheckout}
              disabled={loading}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <CheckoutSheet visible={checkoutVisible} onClose={() => setCheckoutVisible(false)} />
    </View>
  );
};

export default CartScreen;