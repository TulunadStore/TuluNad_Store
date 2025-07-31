// src/api/ordersApi.js

import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api/orders';

/**
 * A collection of functions for interacting with order-related API endpoints.
 */
const ordersApi = {
  /**
   * Places a new order.
   * @param {Array} items - The array of items in the cart.
   * @param {number} totalAmount - The total amount of the order.
   * @param {object} shippingAddress - The user's shipping address.
   * @returns {Promise<object>} A promise that resolves to the response data from the server.
   */
  placeOrder: async (items, totalAmount, shippingAddress) => {
    try {
      const orderData = {
        items,
        totalAmount,
        shippingAddress,
      };
      const response = await axios.post(API_BASE_URL, orderData);
      // The success toast will be handled by the component upon successful navigation.
      return response.data;
    } catch (error) {
      console.error('API Error: placeOrder', error);
      toast.error(error.response?.data?.message || 'Failed to place order.');
      throw error.response?.data || error;
    }
  },

  /**
   * Fetches all orders for the currently authenticated user.
   * @returns {Promise<Array>} A promise that resolves to an array of the user's orders.
   */
  getMyOrders: async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/my`);
        return response.data;
    } catch (error) {
        console.error('API Error: getMyOrders', error);
        toast.error(error.response?.data?.message || 'Failed to fetch your orders.');
        throw error.response?.data || error;
    }
  }
};

export default ordersApi;
