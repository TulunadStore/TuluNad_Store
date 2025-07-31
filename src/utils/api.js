import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust this to your backend URL
  withCredentials: true, // This is important for sending cookies (like JWT)
});

// Optional: Add an interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // You might want to implement a refresh token logic here if your auth supports it
    // For now, if a 401 (Unauthorized) occurs, it means the token is invalid or expired
    // and the user should typically be logged out or redirected to login.
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request, potentially redirecting to login...');
      // This is a basic example; ideally, you'd use your AuthContext's logout function here
      // if (localStorage.getItem('token')) {
      //   localStorage.removeItem('token');
      //   window.location.href = '/login'; // Redirect to login
      // }
    }
    return Promise.reject(error);
  }
);

export default api;