// src/pages/Cart.js

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { pageTransition, buttonClick } from '../utils/animations';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import toast from 'react-hot-toast';

// --- Styled Components ---

const CartContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary-color);
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsWrapper = styled.div`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 10px 30px 30px 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
`;

const CartItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color-light);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 576px) {
    flex-direction: column;
    text-align: center;
  }
`;

const CartItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
`;

const CartItemDetails = styled.div`
  flex-grow: 1;
  h3 {
    font-size: 1.3rem;
    color: var(--text-light);
    margin-bottom: 8px;
  }
  p {
    font-size: 1rem;
    color: var(--text-dark);
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  button {
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--primary-color);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-speed);
    &:hover {
      background-color: var(--primary-color);
      color: white;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1.2rem;
    font-weight: 500;
    min-width: 20px;
    text-align: center;
  }
`;

const RemoveItemButton = styled(motion.button)`
  background: none;
  border: none;
  color: var(--danger-color);
  font-size: 1.3rem;
  cursor: pointer;
  margin-left: auto;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    color: var(--danger-hover);
    background-color: rgba(var(--danger-color-rgb), 0.1);
  }
`;

const CartSummary = styled.div`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  position: sticky;
  top: 100px; /* Adjust based on header height */
  height: fit-content;

  h2 {
    font-size: 1.8rem;
    color: var(--primary-color);
    margin-bottom: 20px;
    text-align: center;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 1.1rem;
  color: var(--text-dark);

  &.total {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color);
    border-top: 1px dashed var(--border-color);
    padding-top: 15px;
    margin-top: 15px;
  }
`;

const CheckoutButton = styled(motion.button)`
  width: 100%;
  background-color: var(--primary-color);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
`;

const ClearCartButton = styled(CheckoutButton)`
    background-color: var(--danger-color);
    margin-top: 10px;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  h2 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
  p {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
  }
`;

// --- Component ---

function Cart() {
  const { cartItems, loading, cartTotalAmount, updateCartItem, removeFromCart, clearUserCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      updateCartItem(cartItemId, newQuantity);
    }
  };

  const handleRemoveItem = (cartItemId, itemName) => {
    toast((t) => (
      <div>
        <p>Remove <b>{itemName}</b> from cart?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button onClick={() => { removeFromCart(cartItemId); toast.dismiss(t.id); }} style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: '#dc3545', color: 'white' }}>Yes, Remove</button>
          <button onClick={() => toast.dismiss(t.id)} style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white' }}>Cancel</button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  const handleClearCart = () => {
    toast((t) => (
      <div>
        <p>Are you sure you want to clear your entire cart?</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button onClick={() => { clearUserCart(); toast.dismiss(t.id); }} style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: '#dc3545', color: 'white' }}>Yes, Clear</button>
            <button onClick={() => toast.dismiss(t.id)} style={{ flex: 1, padding: '8px', borderRadius: '5px', border: 'none', background: '#6c757d', color: 'white' }}>Cancel</button>
        </div>
      </div>
    ), { duration: 6000 });
  };

  if (loading) {
    return <CartContainer><p style={{ textAlign: 'center' }}>Loading your cart...</p></CartContainer>;
  }

  if (cartItems.length === 0) {
    return (
      <CartContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
        <EmptyCartMessage>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything yet. Time to start shopping!</p>
          <Link to="/categories">
            <CheckoutButton whileTap={buttonClick}>Browse Products</CheckoutButton>
          </Link>
        </EmptyCartMessage>
      </CartContainer>
    );
  }

  return (
    <CartContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <PageTitle>Your Shopping Cart</PageTitle>
      <CartLayout>
        <CartItemsWrapper>
          <AnimatePresence>
            {cartItems.map((item) => (
              <CartItem
                key={item.cart_item_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <CartItemImage src={item.product_image_id} alt={item.product_name} />
                <CartItemDetails>
                  <h3>{item.product_name}</h3>
                  <p>Price: ₹{item.product_price.toFixed(2)}</p>
                </CartItemDetails>
                <QuantityControl>
                  <button onClick={() => handleQuantityChange(item.cart_item_id, item.quantity, -1)} disabled={item.quantity <= 1}>
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.cart_item_id, item.quantity, 1)} disabled={item.quantity >= item.product_stock_quantity}>
                    <FaPlus />
                  </button>
                </QuantityControl>
                <p style={{minWidth: '80px', textAlign: 'right', fontWeight: 'bold'}}>₹{(item.quantity * item.product_price).toFixed(2)}</p>
                <RemoveItemButton onClick={() => handleRemoveItem(item.cart_item_id, item.product_name)} whileTap={buttonClick}>
                  <FaTrashAlt />
                </RemoveItemButton>
              </CartItem>
            ))}
          </AnimatePresence>
        </CartItemsWrapper>

        <CartSummary>
          <h2>Order Summary</h2>
          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{cartTotalAmount.toFixed(2)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span>Free</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>₹{cartTotalAmount.toFixed(2)}</span>
          </SummaryRow>
          <CheckoutButton onClick={() => navigate('/checkout')} whileTap={buttonClick}>
            Proceed to Checkout
          </CheckoutButton>
          <ClearCartButton onClick={handleClearCart} whileTap={buttonClick}>
            Clear Cart
          </ClearCartButton>
        </CartSummary>
      </CartLayout>
    </CartContainer>
  );
};

export default Cart;
