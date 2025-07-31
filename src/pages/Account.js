// src/pages/Account.js

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// --- Contexts, APIs, and Utils ---
import { useAuth } from '../contexts/AuthContext';
import userApi from '../api/userApi';
import ordersApi from '../api/ordersApi';
import { pageTransition, buttonClick } from '../utils/animations';
import { FaUserCircle, FaHistory, FaMapMarkerAlt, FaKey, FaSignOutAlt, FaPlus, FaTrashAlt } from 'react-icons/fa';

// --- Styled Components ---

const AccountContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 30px;
  min-height: 100vh;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const AccountSidebar = styled(motion.div)`
  flex: 0 0 280px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 30px 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
  height: fit-content;
  position: sticky;
  top: 100px;

  @media (max-width: 992px) {
    position: static;
    width: 100%;
  }
`;

const AccountContent = styled(motion.div)`
  flex: 1;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-color);
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  color: var(--primary-color);
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
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

const SubmitButton = styled(motion.button)`
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

// --- Component ---

function Account() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'orders':
        return <OrderHistorySection />;
      case 'addresses':
        return <AddressSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <AccountContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <AccountSidebar>
        <SidebarProfile user={user} />
        <SidebarButton text="Profile" icon={<FaUserCircle />} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        <SidebarButton text="Order History" icon={<FaHistory />} active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        <SidebarButton text="Addresses" icon={<FaMapMarkerAlt />} active={activeTab === 'addresses'} onClick={() => setActiveTab('addresses')} />
        <SidebarButton text="Security" icon={<FaKey />} active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
        <SidebarButton text="Logout" icon={<FaSignOutAlt />} onClick={logout} isLogout />
      </AccountSidebar>
      <AccountContent>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </AccountContent>
    </AccountContainer>
  );
}

// --- Sub-components for different sections ---

const SidebarProfile = ({ user }) => (
    <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <FaUserCircle size="4em" color="var(--primary-color)" />
        <h3 style={{marginTop: '10px', color: 'var(--text-light)'}}>{user?.username}</h3>
        <p style={{color: 'var(--text-dark)', fontSize: '0.9rem'}}>{user?.email}</p>
    </div>
);

const SidebarButton = ({ text, icon, active, onClick, isLogout }) => (
    <motion.button
        onClick={onClick}
        whileTap={buttonClick}
        style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '10px',
            background: active ? 'var(--primary-color)' : 'transparent',
            color: isLogout ? 'var(--danger-color)' : 'var(--text-light)',
            border: `1px solid ${active ? 'var(--primary-color)' : 'var(--border-color)'}`,
            borderRadius: '8px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.1rem',
            fontWeight: active ? '600' : '400',
            transition: 'all 0.2s ease-in-out'
        }}
    >
        {icon} {text}
    </motion.button>
);

const InfoCard = styled.div`
    background: var(--input-bg);
    padding: 20px;
    border-radius: 10px;
    border-left: 4px solid var(--primary-color);
    margin-bottom: 15px;

    strong {
        display: block;
        color: var(--text-dark);
        font-size: 0.9rem;
        margin-bottom: 5px;
    }

    p {
        color: var(--text-light);
        font-size: 1.1rem;
    }
`;

const ProfileSection = ({ user }) => (
    <motion.div key="profile" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
        <SectionTitle>Your Profile</SectionTitle>
        <InfoCard>
            <strong>Username</strong>
            <p>{user?.username}</p>
        </InfoCard>
        <InfoCard>
            <strong>Email Address</strong>
            <p>{user?.email}</p>
        </InfoCard>
        <InfoCard>
            <strong>Member Since</strong>
            <p>{new Date(user?.created_at).toLocaleDateString()}</p>
        </InfoCard>
    </motion.div>
);

const OrderHistorySection = () => {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        ordersApi.getMyOrders().then(setOrders).catch(err => toast.error("Could not fetch orders."));
    }, []);
    return (
        <motion.div key="orders" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <SectionTitle>Order History</SectionTitle>
            {orders.length > 0 ? orders.map(order => (
                <div key={order.order_id} style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '8px', marginBottom: '15px'}}>
                    <h4>Order #{order.order_id} - {new Date(order.order_date).toLocaleDateString()}</h4>
                    <p>Status: <span style={{fontWeight: 'bold', color: 'var(--accent-color)'}}>{order.status}</span></p>
                    <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                </div>
            )) : <p>You have no past orders.</p>}
        </motion.div>
    );
};

const AddressSection = () => {
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ fullName: '', address1: '', city: '', state: '', pincode: '', phone: '' });

    const fetchAddresses = useCallback(() => {
        userApi.getAddresses().then(setAddresses).catch(err => toast.error("Could not fetch addresses."));
    }, []);

    useEffect(fetchAddresses, [fetchAddresses]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        await userApi.addAddress(newAddress);
        fetchAddresses();
        setShowForm(false);
        setNewAddress({ fullName: '', address1: '', city: '', state: '', pincode: '', phone: '' });
    };

    const handleDeleteAddress = async (id) => {
        await userApi.deleteAddress(id);
        toast.success("Address deleted!");
        fetchAddresses();
    };
    
    const handleInputChange = (e) => {
        setNewAddress({...newAddress, [e.target.name]: e.target.value});
    };

    return (
        <motion.div key="addresses" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <SectionTitle>Your Addresses</SectionTitle>
            {addresses.map(addr => (
                <div key={addr.id} style={{background: 'var(--input-bg)', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <strong>{addr.fullName}</strong>
                        <p>{`${addr.address1}, ${addr.city}, ${addr.state} - ${addr.pincode}`}</p>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr.id)} style={{background: 'none', border: 'none', color: 'var(--danger-color)', fontSize: '1.2rem'}}><FaTrashAlt /></button>
                </div>
            ))}
            <SubmitButton onClick={() => setShowForm(!showForm)} style={{background: 'var(--secondary-color)'}}><FaPlus /> {showForm ? 'Cancel' : 'Add New Address'}</SubmitButton>
            {showForm && (
                <motion.form onSubmit={handleAddAddress} style={{marginTop: '20px'}} initial={{opacity: 0}} animate={{opacity: 1}}>
                    <FormGroup><Label>Full Name</Label><Input name="fullName" value={newAddress.fullName} onChange={handleInputChange} required /></FormGroup>
                    <FormGroup><Label>Address</Label><Input name="address1" value={newAddress.address1} onChange={handleInputChange} required /></FormGroup>
                    <FormGroup><Label>City</Label><Input name="city" value={newAddress.city} onChange={handleInputChange} required /></FormGroup>
                    <FormGroup><Label>State</Label><Input name="state" value={newAddress.state} onChange={handleInputChange} required /></FormGroup>
                    <FormGroup><Label>Pincode</Label><Input name="pincode" value={newAddress.pincode} onChange={handleInputChange} required /></FormGroup>
                    <FormGroup><Label>Phone</Label><Input name="phone" value={newAddress.phone} onChange={handleInputChange} required /></FormGroup>
                    <SubmitButton type="submit">Save Address</SubmitButton>
                </motion.form>
            )}
        </motion.div>
    );
};

const SecuritySection = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userApi.updatePassword({ currentPassword, newPassword });
            setCurrentPassword('');
            setNewPassword('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div key="security" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
            <SectionTitle>Change Your Password</SectionTitle>
            <form onSubmit={handlePasswordChange}>
                <FormGroup>
                    <Label>Current Password</Label>
                    <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                </FormGroup>
                <FormGroup>
                    <Label>New Password</Label>
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </FormGroup>
                <SubmitButton type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</SubmitButton>
            </form>
        </motion.div>
    );
};

export default Account;
