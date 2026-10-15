import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
  toggleWishlist as apiToggleWishlist
} from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWishlist();
      setWishlistItems(data.wishlist || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => {
        const id = item._id || item;
        return id === productId;
      });
    },
    [wishlistItems]
  );

  const toggleItemWishlist = async (productId) => {
    try {
      setActionLoadingId(productId);
      setError(null);
      const res = await apiToggleWishlist(productId);
      await refreshWishlist();
      return res;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  const removeItem = async (productId) => {
    try {
      setActionLoadingId(productId);
      setError(null);
      await apiRemoveFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => (item._id || item) !== productId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        error,
        actionLoadingId,
        isInWishlist,
        toggleItemWishlist,
        removeItem,
        refreshWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
