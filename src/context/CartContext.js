// src/context/CartProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setCartItems([]);
        setFavorites([]);
        return;
      }

      const cartKey = `cartItems_${user.uid}`;
      const favoritesKey = `favorites_${user.uid}`;

      try {
        const savedCart = await AsyncStorage.getItem(cartKey);
        const savedFavorites = await AsyncStorage.getItem(favoritesKey);
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(
            parsedCart.map((item) => ({
              ...item,
              selectedItems: item.selectedItems || {},
              store: item.store || {}, // Ensure store data is preserved
            }))
          );
        } else {
          setCartItems([]);
        }
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        } else {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Error loading cart/favorites:", error);
        showToast("error", "Load Error", "Failed to load cart or favorites.");
      }
    };
    loadCart();
  }, [user]);

  useEffect(() => {
    const saveCart = async () => {
      if (!user || loading) return;

      const cartKey = `cartItems_${user.uid}`;
      const favoritesKey = `favorites_${user.uid}`;

      try {
        await AsyncStorage.setItem(cartKey, JSON.stringify(cartItems));
        await AsyncStorage.setItem(favoritesKey, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving cart/favorites:", error);
        showToast("error", "Save Error", "Failed to save cart or favorites.");
      }
    };
    saveCart();
  }, [cartItems, favorites, user, loading]);

  const addToCart = (product, store) => {
    if (!user) {
      showToast("error", "Login Required", "Please log in to add items to cart.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const safeProduct = {
        ...product,
        selectedItems: product.selectedItems || {},
        totalPrice: product.totalPrice || 0,
        store: store || {}, // Include store data in the cart item
      };
      const existingItem = cartItems.find((item) => item.id === product.id);
      if (existingItem) {
        const updatedCart = cartItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                selectedItems: { ...item.selectedItems, ...safeProduct.selectedItems },
                totalPrice: (item.totalPrice || 0) + (safeProduct.totalPrice || 0),
                store: store || item.store, // Preserve store data
              }
            : item
        );
        setCartItems(updatedCart);
        showToast("success", "Updated", `${product.name} updated in cart!`);
      } else {
        setCartItems([...cartItems, safeProduct]);
        showToast("success", "Added", `${product.name} added to cart!`);
      }
      setLoading(false);
    }, 500);
  };

  const removeFromCart = (productId) => {
    setLoading(true);
    setTimeout(() => {
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      setCartItems(updatedCart);
      showToast("info", "Removed", "Item removed from cart!");
      setLoading(false);
    }, 500);
  };

  const adjustQuantity = (productId, category, itemName, change) => {
    setLoading(true);
    setTimeout(() => {
      const updatedCart = cartItems.map((item) => {
        if (item.id === productId && item.selectedItems && item.selectedItems[category]) {
          const updatedItems = item.selectedItems[category].map((selItem) => {
            if (selItem.name === itemName) {
              const newQuantity = (selItem.quantity || 1) + change;
              if (newQuantity <= 0) return null;
              return { ...selItem, quantity: newQuantity };
            }
            return selItem;
          }).filter(Boolean);

          const newTotalPrice = Object.entries({ ...item.selectedItems, [category]: updatedItems })
            .reduce((sum, [cat, items]) => {
              return sum + (Array.isArray(items) ? items.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0) : 0);
            }, 0);

          return {
            ...item,
            selectedItems: { ...item.selectedItems, [category]: updatedItems },
            totalPrice: newTotalPrice,
          };
        }
        return item;
      }).filter((item) => item.selectedItems && Object.keys(item.selectedItems).length > 0);
      setCartItems(updatedCart);
      showToast("info", change > 0 ? "Increased" : "Reduced", `Quantity adjusted!`);
      setLoading(false);
    }, 500);
  };

  const toggleFavorite = (product) => {
    if (!user) {
      showToast("error", "Login Required", "Please log in to manage favorites.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const isFavorite = favorites.some((fav) => fav.id === product.id);
      if (isFavorite) {
        setFavorites(favorites.filter((fav) => fav.id !== product.id));
        showToast("info", "Removed", `${product.name} removed from favorites!`);
      } else {
        setFavorites([...favorites, product]);
        showToast("success", "Added", `${product.name} added to favorites!`);
      }
      setLoading(false);
    }, 500);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => {
      const selectedCount = item.selectedItems
        ? Object.values(item.selectedItems)
            .flat()
            .reduce((sum, selItem) => sum + (selItem.quantity || 1), 0)
        : 0;
      return count + selectedCount;
    }, 0);
  };

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        favorites,
        addToCart,
        removeFromCart,
        adjustQuantity,
        toggleFavorite,
        loading,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;