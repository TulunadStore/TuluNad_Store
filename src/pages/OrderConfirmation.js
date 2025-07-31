// src/pages/OrderConfirmation.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

// --- APIs and Utils ---
import ordersApi from '../api/ordersApi';
import { pageTransition, buttonClick } from '../utils/animations';

// --- Styled Components ---

const ConfirmationContainer = styled(motion.div)`
  padding: 60px 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  min-height: 100vh;
`;

const ConfirmationBox = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--primary-color);
`;

const SuccessIcon = styled(motion.div)`
  font-size: 5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  color: var(--text-light);
  margin-bottom: 15px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-bottom: 25px;
`;

const OrderIdText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 30px;
  background-color: var(--input-bg);
  padding: 10px;
  border-radius: 8px;
  display: inline-block;
`;

const DetailSection = styled.div`
  margin-top: 30px;
  border-top: 1px dashed var(--border-color);
  padding-top: 30px;
  text-align: left;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const OrderSummaryList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
`;

const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: var(--text-dark);
`;

const TotalAmount = styled.p`
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--accent-color);
  text-align: right;
  margin-top: 10px;
`;

const ContinueButton = styled(motion.button)`
  margin-top: 40px;
  padding: 15px 30px;
  background-color: var(--primary-color);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
`;

// --- Component ---

function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided.');
        setLoading(false);
        return;
      }
      try {
        // Since getMyOrders returns an array, we find the specific order
        const allOrders = await ordersApi.getMyOrders();
        const foundOrder = allOrders.find(o => String(o.order_id) === String(orderId));
        
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Order not found or you do not have permission to view it.');
        }
      } catch (err) {
        setError('Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <ConfirmationContainer><p>Loading your order confirmation...</p></ConfirmationContainer>;
  }

  if (error) {
    return <ConfirmationContainer><p style={{ color: 'red' }}>{error}</p></ConfirmationContainer>;
  }

  return (
    <ConfirmationContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <ConfirmationBox initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
        <SuccessIcon initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }}>
          <FaCheckCircle />
        </SuccessIcon>
        <Title>Order Placed Successfully!</Title>
        <Subtitle>Thank you for your purchase. A confirmation has been sent to your email.</Subtitle>
        <OrderIdText>Order ID: #{order?.order_id}</OrderIdText>

        {order && (
          <DetailSection>
            <SectionTitle>Order Summary</SectionTitle>
            <OrderSummaryList>
              {order.items.map((item, index) => (
                <OrderItem key={index}>
                  <span>{item.product_name} (x{item.quantity})</span>
                  <span>₹{(item.quantity * item.item_price).toFixed(2)}</span>
                </OrderItem>
              ))}
            </OrderSummaryList>
            <TotalAmount>Total Paid: ₹{order.total_amount.toFixed(2)}</TotalAmount>
          </DetailSection>
        )}

        <Link to="/">
          <ContinueButton whileTap={buttonClick}>Continue Shopping</ContinueButton>
        </Link>
      </ConfirmationBox>
    </ConfirmationContainer>
  );
}

export default OrderConfirmation;
