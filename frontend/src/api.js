// src/api.js

import axios from 'axios';
import Swal from 'sweetalert2';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handles global errors, like session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401 (Unauthorized) or 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear session storage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('userId');
      
      // Show an alert and redirect to the login page
      Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'You have been logged out. Please log in again.',
          confirmButtonColor: '#4a90e2',
      }).then(() => {
          // Use window.location.href to force a full page reload, clearing all state
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
      });
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api;