import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartQuantity as apiUpdateQuantity,
  removeFromCart as apiRemoveFromCart
} from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch cart from backend whenever user is authenticated
  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCart();
      setCartItems(data.cart || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Add product to cart
  const addToCart = async (productId) => {
    try {
      setActionLoadingId(productId);
      setError(null);
      const data = await apiAddToCart(productId);
      setCartItems(data.cart || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Update quantity of a product in the cart
  const updateQuantity = async (productId, quantity) => {
    try {
      setActionLoadingId(productId);
      setError(null);
      const data = await apiUpdateQuantity(productId, quantity);
      setCartItems(data.cart || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Remove a product from the cart
  const removeFromCart = async (productId) => {
    try {
      setActionLoadingId(productId);
      setError(null);
      const data = await apiRemoveFromCart(productId);
      setCartItems(data.cart || []);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  // Clear cart state locally (called after verified payment)
  const clearCart = () => {
    setCartItems([]);
    setError(null);
  };

  // Derived values: Subtotal and Total Quantity count
  const { subtotal, totalItems } = useMemo(() => {
    let sum = 0;
    let count = 0;

    cartItems.forEach((item) => {
      if (item && item.product) {
        const itemPrice = Number(item.product.price) || 0;
        const itemQty = Number(item.quantity) || 0;
        sum += itemPrice * itemQty;
        count += itemQty;
      }
    });

    return { subtotal: sum, totalItems: count };
  }, [cartItems]);

  // Check if a specific product is currently in the cart and return its quantity
  const getProductCartQuantity = useCallback(
    (productId) => {
      const item = cartItems.find(
        (ci) => ci.product && (ci.product._id === productId || ci.product === productId)
      );
      return item ? item.quantity : 0;
    },
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        error,
        actionLoadingId,
        subtotal,
        totalItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        getProductCartQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
