// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Create a root element for React to render into.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main application.
root.render(
  <React.StrictMode>
    {/* BrowserRouter handles the routing for the entire application. */}
    <BrowserRouter>
      {/* AuthProvider makes authentication state (user, token) available to all components. */}
      <AuthProvider>
        {/* CartProvider manages the shopping cart state. */}
        <CartProvider>
          {/* The main App component which contains all other components and pages. */}
          <App />
          {/* Toaster is for displaying notifications (e.g., "Item added to cart"). */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
