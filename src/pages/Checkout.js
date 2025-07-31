// src/pages/Checkout.js

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Contexts and APIs ---
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import ordersApi from '../api/ordersApi';
import userApi from '../api/userApi';

// --- Utilities and Icons ---
import { pageTransition, buttonClick } from '../utils/animations';
import { FaCheckCircle, FaMapMarkerAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';

// --- Styled Components ---

const CheckoutContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary-color);
`;

const CheckoutStepper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  position: relative;
`;

const Step = styled(motion.div)`
  text-align: center;
  color: ${props => props.$active ? 'var(--text-light)' : 'var(--text-dark)'};
  
  span {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--input-bg)'};
    border: 2px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
    line-height: 36px;
    margin: 0 auto 10px;
    font-weight: 700;
    transition: all var(--transition-speed);
  }
`;

const CheckoutSection = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: var(--text-light);
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  background-color: var(--input-bg);
  color: var(--text-light);
  border-radius: 8px;
  font-size: 1rem;
`;

const AddressSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const AddressOption = styled.label`
  background-color: var(--input-bg);
  border: 2px solid ${props => props.$selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  gap: 15px;
  transition: all var(--transition-speed);
  position: relative;

  &:hover {
    border-color: var(--primary-color);
  }
`;

const AddNewAddressButton = styled(motion.button)`
  background: none;
  border: 2px dashed var(--primary-color);
  color: var(--primary-color);
  padding: 15px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const ActionButton = styled(motion.button)`
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const OrderConfirmation = styled(motion.div)`
  text-align: center;
  padding: 60px 40px;
  h2 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
`;

// --- Component ---

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotalAmount, clearUserCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({ fullName: '', address1: '', city: '', state: '', pincode: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const shippingCost = cartTotalAmount > 500 ? 0 : 50;
  const totalAmount = cartTotalAmount + shippingCost;

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const fetchedAddresses = await userApi.getAddresses();
      setAddresses(fetchedAddresses);
      if (fetchedAddresses.length > 0) {
        setSelectedAddressId(fetchedAddresses[0].id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (error) {
      toast.error('Could not load saved addresses.');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      navigate('/categories');
    }
    fetchAddresses();
  }, [cartItems, navigate, fetchAddresses]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };
  
  const handleNewAddressFormToggle = () => {
    setSelectedAddressId(null);
    setShippingInfo({ fullName: '', address1: '', city: '', state: '', pincode: '', phone: '' });
    setShowNewAddressForm(true);
  }

  const handleShippingChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
        let finalShippingAddress;
        if (showNewAddressForm) {
            const { fullName, address1, city, state, pincode, phone } = shippingInfo;
            if (!fullName || !address1 || !city || !state || !pincode || !phone) {
                toast.error('Please fill in all address fields.');
                return;
            }
            // Optionally save the new address
            try {
                const newAddress = await userApi.addAddress(shippingInfo);
                finalShippingAddress = { ...shippingInfo, id: newAddress.addressId };
                // Refresh address list
                await fetchAddresses();
                setSelectedAddressId(newAddress.addressId);
                setShowNewAddressForm(false);
            } catch (error) {
                return; // Stop if address saving fails
            }
        } else if (selectedAddressId) {
            finalShippingAddress = addresses.find(addr => addr.id === selectedAddressId);
        } else {
            toast.error('Please select or add a shipping address.');
            return;
        }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePlaceOrder = async () => {
    let finalShippingAddress;
    if (selectedAddressId) {
        finalShippingAddress = addresses.find(addr => addr.id === selectedAddressId);
    } else {
        toast.error('No shipping address selected.');
        return;
    }

    try {
      const orderDetails = await ordersApi.placeOrder(cartItems, totalAmount, finalShippingAddress);
      clearUserCart();
      navigate(`/order-confirmation/${orderDetails.orderId}`);
    } catch (error) {
      // Error toast is already shown in the api file
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CheckoutSection key="shipping">
            <SectionTitle>Shipping Information</SectionTitle>
            <AddressSelectionContainer>
              {addresses.map(addr => (
                <AddressOption key={addr.id} $selected={selectedAddressId === addr.id}>
                  <input type="radio" name="address" onChange={() => handleAddressSelect(addr.id)} checked={selectedAddressId === addr.id} />
                  <div>
                    <strong>{addr.fullName}</strong>
                    <p>{`${addr.address1}, ${addr.city}, ${addr.state} - ${addr.pincode}`}</p>
                    <p>Phone: {addr.phone}</p>
                  </div>
                </AddressOption>
              ))}
            </AddressSelectionContainer>
            {showNewAddressForm ? (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}}>
                    <FormGroup><Label>Full Name</Label><Input name="fullName" value={shippingInfo.fullName} onChange={handleShippingChange} /></FormGroup>
                    <FormGroup><Label>Address Line</Label><Input name="address1" value={shippingInfo.address1} onChange={handleShippingChange} /></FormGroup>
                    <FormGroup><Label>City</Label><Input name="city" value={shippingInfo.city} onChange={handleShippingChange} /></FormGroup>
                    <FormGroup><Label>State</Label><Input name="state" value={shippingInfo.state} onChange={handleShippingChange} /></FormGroup>
                    <FormGroup><Label>Pincode</Label><Input name="pincode" value={shippingInfo.pincode} onChange={handleShippingChange} /></FormGroup>
                    <FormGroup><Label>Phone</Label><Input name="phone" value={shippingInfo.phone} onChange={handleShippingChange} /></FormGroup>
                </motion.div>
            ) : (
                <AddNewAddressButton onClick={handleNewAddressFormToggle} whileTap={buttonClick}><FaPlus /> Add New Address</AddNewAddressButton>
            )}
            <ButtonGroup>
                <ActionButton onClick={() => navigate('/cart')} style={{background: 'var(--input-bg)', color: 'var(--text-light)'}}>Back to Cart</ActionButton>
                <ActionButton onClick={handleNextStep} style={{background: 'var(--primary-color)', color: 'white'}}>Continue to Payment</ActionButton>
            </ButtonGroup>
          </CheckoutSection>
        );
      case 2:
        return (
          <CheckoutSection key="payment">
            <SectionTitle>Payment Method</SectionTitle>
             <AddressOption $selected={paymentMethod === 'cod'}>
                <input type="radio" name="payment" onChange={() => setPaymentMethod('cod')} checked={paymentMethod === 'cod'} />
                <span>Cash on Delivery (COD)</span>
            </AddressOption>
            <AddressOption $selected={paymentMethod === 'upi'} style={{marginTop: '15px'}}>
                <input type="radio" name="payment" onChange={() => setPaymentMethod('upi')} checked={paymentMethod === 'upi'} />
                <span>UPI / QR Code (Prepaid)</span>
            </AddressOption>
            <ButtonGroup>
                <ActionButton onClick={() => setCurrentStep(1)} style={{background: 'var(--input-bg)', color: 'var(--text-light)'}}>Back to Shipping</ActionButton>
                <ActionButton onClick={() => setCurrentStep(3)} style={{background: 'var(--primary-color)', color: 'white'}}>Review Order</ActionButton>
            </ButtonGroup>
          </CheckoutSection>
        );
      case 3:
        const address = addresses.find(a => a.id === selectedAddressId);
        return (
          <CheckoutSection key="review">
            <SectionTitle>Review Your Order</SectionTitle>
            <div>
                <h4>Items:</h4>
                {cartItems.map(item => <p key={item.cart_item_id}>{item.product_name} x {item.quantity} - <b>₹{(item.product_price * item.quantity).toFixed(2)}</b></p>)}
                <hr style={{margin: '15px 0', border: '1px solid var(--border-color)'}}/>
                <p>Subtotal: <b>₹{cartTotalAmount.toFixed(2)}</b></p>
                <p>Shipping: <b>₹{shippingCost.toFixed(2)}</b></p>
                <h3>Total: <b>₹{totalAmount.toFixed(2)}</b></h3>
            </div>
            <div style={{marginTop: '20px'}}>
                <h4>Shipping to:</h4>
                <p>{address?.fullName}, {address?.address1}, {address?.city} - {address?.pincode}</p>
            </div>
            <div style={{marginTop: '20px'}}>
                <h4>Payment Method:</h4>
                <p>{paymentMethod.toUpperCase()}</p>
            </div>
            <ButtonGroup>
                <ActionButton onClick={() => setCurrentStep(2)} style={{background: 'var(--input-bg)', color: 'var(--text-light)'}}>Back to Payment</ActionButton>
                <ActionButton onClick={handlePlaceOrder} style={{background: 'var(--accent-color)', color: 'white'}}>Place Order</ActionButton>
            </ButtonGroup>
          </CheckoutSection>
        );
      default:
        return null;
    }
  };

  return (
    <CheckoutContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <PageTitle>Checkout</PageTitle>
      <CheckoutStepper>
        <Step $active={currentStep >= 1}><span>1</span>Shipping</Step>
        <Step $active={currentStep >= 2}><span>2</span>Payment</Step>
        <Step $active={currentStep >= 3}><span>3</span>Review</Step>
      </CheckoutStepper>
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </CheckoutContainer>
  );
}

export default Checkout;
