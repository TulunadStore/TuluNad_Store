// src/App.js

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AnimatePresence } from 'framer-motion';

// --- Layout Components ---
import Header from './components/Header';
import Footer from './components/Footer';

// --- Page Components ---
import Home from './pages/Home';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import OrderConfirmation from './pages/OrderConfirmation';

// --- Utilities & Context ---
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';

// --- Styled Components ---
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Adjust this value based on the actual height of your header */
`;

function App() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AppContainer>
      <Header />
      <MainContent>
        {/* AnimatePresence allows for exit animations when routes change */}
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />

            {/* Private Routes - only accessible to authenticated users */}
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
             <Route
              path="/order-confirmation/:orderId"
              element={
                <PrivateRoute>
                  <OrderConfirmation />
                </PrivateRoute>
              }
            />

            {/* Admin Route - only accessible to users with the 'admin' role */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            
            {/* Fallback Route for non-matching paths */}
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </MainContent>
      <Footer />
    </AppContainer>
  );
}

export default App;
