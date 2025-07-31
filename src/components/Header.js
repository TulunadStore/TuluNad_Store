// src/components/Header.js

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaUserCircle, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { itemHover, buttonClick } from '../utils/animations';

// --- Styled Components ---

const StyledHeader = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--dark-card-bg);
  padding: 15px 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 992px) {
    padding: 15px 20px;
  }
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
  text-decoration: none;
  transition: all var(--transition-speed);

  &:hover {
    color: var(--accent-color);
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 30px;
  margin: 0 auto; /* Center the nav links */

  @media (max-width: 992px) {
    display: none;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  position: relative;
  transition: all var(--transition-speed);
  padding: 5px 0;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--primary-color);
    transition: width var(--transition-speed);
  }

  &:hover, &.active {
    color: var(--primary-color);
  }

  &.active::after {
    width: 100%;
  }
`;

const SearchContainer = styled(motion.form)`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 250px;
    padding: 8px 15px 8px 40px;
    border: 1px solid var(--border-color);
    border-radius: 20px;
    background-color: var(--input-bg);
    color: var(--text-light);
    font-size: 0.95rem;
    transition: all var(--transition-speed);

    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
      width: 300px;
    }
  }

  .search-icon {
    position: absolute;
    left: 15px;
    color: var(--text-dark);
    font-size: 1.1rem;
  }
  
  @media (max-width: 1200px) {
    display: none; /* Hide search on medium screens, will be in mobile menu */
  }
`;

const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StyledIconLink = styled(motion.div)`
  position: relative;
  cursor: pointer;
  color: var(--text-light);
  font-size: 1.5rem;
  transition: color var(--transition-speed);
  padding: 5px;

  &:hover {
    color: var(--primary-color);
  }

  .cart-count {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: var(--primary-color);
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    border-radius: 50%;
    padding: 3px 6px;
    line-height: 1;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  font-size: 1.8rem;
  color: var(--text-light);
  cursor: pointer;

  @media (max-width: 992px) {
    display: block;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1000;
`;

const MobileMenuContent = styled(motion.div)`
  background-color: var(--dark-card-bg);
  height: 100%;
  width: 300px;
  position: fixed;
  top: 0;
  right: 0;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: -10px 0 30px rgba(0,0,0,0.5);

  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    border: none;
    color: var(--text-light);
    font-size: 2rem;
    cursor: pointer;
  }
`;

const MobileNavLink = styled(NavLink)`
  color: var(--text-light);
  font-size: 1.5rem;
  padding: 10px 15px;
  border-radius: 8px;
  text-align: center;
  transition: all var(--transition-speed);

  &:hover, &.active {
    color: var(--primary-color);
    background-color: var(--input-bg);
  }
`;

const MobileSearchContainer = styled(SearchContainer)`
    display: flex; /* Show in mobile menu */
    width: 100%;
    margin-top: 20px;
    input {
        width: 100%;
        &:focus {
            width: 100%;
        }
    }
`;

// --- Component ---

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/categories?search=${searchTerm.trim()}`);
    } else {
      navigate('/categories');
    }
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { duration: 0.3 } }
  };

  return (
    <>
      <StyledHeader
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <Logo to="/">Tulunad Store</Logo>

        <Nav>
          <StyledNavLink to="/">Home</StyledNavLink>
          <StyledNavLink to="/categories">Products</StyledNavLink>
          {isAuthenticated && user?.role === 'admin' && (
            <StyledNavLink to="/admin">Admin</StyledNavLink>
          )}
        </Nav>
        
        <SearchContainer onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </SearchContainer>

        <IconGroup>
          <StyledIconLink whileHover="hover" onClick={() => navigate(isAuthenticated ? '/account' : '/login')}>
            <FaUserCircle />
          </StyledIconLink>
          <StyledIconLink whileHover="hover" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </StyledIconLink>
          <MobileMenuIcon onClick={() => setMobileMenuOpen(true)}>
            <FaBars />
          </MobileMenuIcon>
        </IconGroup>
      </StyledHeader>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MobileMenuContent
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-button" onClick={() => setMobileMenuOpen(false)}><FaTimes /></button>
              
              <MobileSearchContainer onSubmit={handleSearch}>
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </MobileSearchContainer>

              <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
              <MobileNavLink to="/categories" onClick={() => setMobileMenuOpen(false)}>Products</MobileNavLink>
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</MobileNavLink>
                  )}
                  <MobileNavLink to="/account" onClick={() => setMobileMenuOpen(false)}>Account</MobileNavLink>
                  <MobileNavLink as="button" onClick={handleLogout}>Logout</MobileNavLink>
                </>
              ) : (
                <>
                  <MobileNavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>Signup</MobileNavLink>
                  <MobileNavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
                </>
              )}
            </MobileMenuContent>
          </MobileMenuOverlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
