// src/api/userApi.js

import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api/users';

/**
 * A collection of functions for interacting with user-related API endpoints.
 */
const userApi = {
  /**
   * Fetches all saved addresses for the currently authenticated user.
   * @returns {Promise<Array>} A promise that resolves to an array of address objects.
   */
  getAddresses: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/addresses`);
      return response.data;
    } catch (error) {
      console.error('API Error: getAddresses', error);
      // We don't show a toast here, as the component will handle the error display.
      throw error.response?.data || error;
    }
  },

  /**
   * Adds a new shipping address for the currently authenticated user.
   * @param {object} addressData - The new address information.
   * @returns {Promise<object>} A promise that resolves to the response data from the server.
   */
  addAddress: async (addressData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/addresses`, addressData);
      toast.success('Address added successfully!');
      return response.data;
    } catch (error) {
      console.error('API Error: addAddress', error);
      toast.error(error.response?.data?.message || 'Failed to add address.');
      throw error.response?.data || error;
    }
  },

  /**
   * Deletes a specific address for the currently authenticated user.
   * @param {number} addressId - The ID of the address to delete.
   * @returns {Promise<object>} A promise that resolves to the response data from the server.
   */
  deleteAddress: async (addressId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/addresses/${addressId}`);
      // The component calling this will show the success toast.
      return response.data;
    } catch (error) {
      console.error('API Error: deleteAddress', error);
      toast.error(error.response?.data?.message || 'Failed to delete address.');
      throw error.response?.data || error;
    }
  },
  
  /**
   * Updates the password for the currently authenticated user.
   * @param {object} passwordData - Object containing currentPassword and newPassword.
   * @returns {Promise<object>} A promise that resolves to the response data.
   */
  updatePassword: async (passwordData) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/updatePassword`, passwordData);
        toast.success('Password updated successfully!');
        return response.data;
    } catch (error) {
        console.error('API Error: updatePassword', error);
        toast.error(error.response?.data?.message || 'Failed to update password.');
        throw error.response?.data || error;
    }
  }
};

export default userApi;
