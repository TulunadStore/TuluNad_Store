// src/contexts/CartContext.js

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Import useAuth to check authentication status

// Create the context
const CartContext = createContext();

// Custom hook for easy access to the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// The provider component that will wrap the application
export const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth(); // Get auth status
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true); // Separate loading state for cart operations

  const API_BASE_URL = 'http://localhost:5000/api';

  /**
   * Fetches the user's cart items from the backend.
   * This function is memoized with useCallback to prevent unnecessary re-renders.
   */
  const fetchCartItems = useCallback(async () => {
    // Only proceed if authentication is confirmed and the user is logged in.
    if (!isAuthenticated) {
      setCartItems([]); // Clear cart if user is not authenticated
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/cart`);
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      // Don't show a toast for a failed initial fetch, as it might be common (e.g., empty cart).
      setCartItems([]); // Clear cart on error to prevent displaying stale data
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]); // Dependency: re-run only when authentication status changes

  // Effect to fetch cart items when auth status changes (e.g., on login/logout).
  // It waits for the initial authentication check to complete (authLoading === false).
  useEffect(() => {
    if (!authLoading) {
      fetchCartItems();
    }
  }, [authLoading, fetchCartItems]);

  /**
   * Adds a product to the cart.
   * @param {number} productId - The ID of the product to add.
   * @param {number} quantity - The quantity to add.
   */
  const addToCart = async (productId, quantity) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/cart`, { productId, quantity });
      toast.success('Item added to cart!');
      await fetchCartItems(); // Re-fetch to update the cart state
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.response?.data?.message || 'Failed to add item to cart.');
    }
  };

  /**
   * Updates the quantity of an item in the cart.
   * @param {number} cartItemId - The ID of the cart item.
   * @param {number} quantity - The new quantity.
   */
  const updateCartItem = async (cartItemId, quantity) => {
    try {
      await axios.put(`${API_BASE_URL}/cart/${cartItemId}`, { quantity });
      await fetchCartItems(); // Re-fetch to update state
    } catch (error) {
      console.error("Error updating cart item:", error);
      toast.error(error.response?.data?.message || 'Failed to update item quantity.');
    }
  };

  /**
   * Removes an item from the cart.
   * @param {number} cartItemId - The ID of the cart item to remove.
   */
  const removeFromCart = async (cartItemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/${cartItemId}`);
      toast.success('Item removed from cart.');
      await fetchCartItems(); // Re-fetch to update state
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(error.response?.data?.message || 'Failed to remove item from cart.');
    }
  };

  /**
   * Clears all items from the user's cart.
   */
  const clearUserCart = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/cart/clear`);
      toast.success('Cart cleared successfully.');
      setCartItems([]); // Immediately update UI for a faster response
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error(error.response?.data?.message || 'Failed to clear cart.');
    }
  };

  // Calculate total amount and item count from the cartItems state
  const cartTotalAmount = cartItems.reduce((total, item) => total + item.product_price * item.quantity, 0);
  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // The value provided to all consumer components
  const value = {
    cartItems,
    loading,
    cartTotalAmount,
    cartTotalItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearUserCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
