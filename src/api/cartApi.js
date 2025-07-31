import axios from 'axios';
import { toast } from 'react-hot-toast'; 

const API_URL = 'http://localhost:5000/api/cart'; // Your backend cart API base URL

const cartApi = {
  // Axios will now automatically include the Authorization header
  // because it's set globally in AuthContext.js after login.

  /**
   * Add item to cart or update quantity
   * @param {string} productId - The ID of the product to add.
   * @param {number} quantity - The quantity of the product.
   * @returns {Promise<object>} The response data from the server.
   */
  addItem: async (productId, quantity) => { 
    try {
      const response = await axios.post(API_URL, { productId, quantity }); 
      toast.success(response.data.message || 'Product added to cart!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add product to cart.';
      toast.error(errorMessage);
      console.error('Error adding item to cart:', error.response || error);
      throw error;
    }
  },

  /**
   * Get all cart items for the logged-in user
   * @returns {Promise<Array>} An array of cart items.
   */
  getCart: async () => { 
    try {
      const response = await axios.get(API_URL); 
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch cart items.';
      // Do not show toast for 401 on initial fetch, PrivateRoute handles it
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error(errorMessage);
      }
      console.error('Error fetching cart:', error.response || error);
      throw error;
    }
  },

  /**
   * Update quantity of an item in the cart
   * @param {string} cartItemId - The ID of the cart item to update.
   * @param {number} quantity - The new quantity.
   * @returns {Promise<object>} The response data from the server.
   */
  updateItemQuantity: async (cartItemId, quantity) => { 
    try {
      const response = await axios.put(`${API_URL}/${cartItemId}`, { quantity }); 
      toast.success(response.data.message || 'Cart item quantity updated!');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart item quantity.';
      toast.error(errorMessage);
      console.error('Error updating cart item quantity:', error.response || error);
      throw error;
    }
  },

  /**
   * Remove an item from the cart
   * @param {string} cartItemId - The ID of the cart item to remove.
   * @returns {Promise<object>} The response data from the server.
   */
  removeItem: async (cartItemId) => { 
    try {
      const response = await axios.delete(`${API_URL}/${cartItemId}`); 
      toast.success(response.data.message || 'Product removed from cart.');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove product from cart.';
      toast.error(errorMessage);
      console.error('Error removing item from cart:', error.response || error);
      throw error;
    }
  },

  /**
   * Clear the entire cart for the logged-in user
   * @returns {Promise<object>} The response data from the server.
   */
  clearCart: async () => { 
    try {
      const response = await axios.delete(`${API_URL}/clear`); 
      toast.success(response.data.message || 'Cart cleared successfully.');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart.';
      toast.error(errorMessage);
      console.error('Error clearing cart:', error.response || error);
      throw error;
    }
  }
};

export default cartApi;
