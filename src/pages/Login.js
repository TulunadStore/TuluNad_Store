// src/pages/Login.js

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Context and Utilities ---
import { useAuth } from '../contexts/AuthContext';
import { pageTransition, buttonClick } from '../utils/animations';

// --- Styled Components ---

const LoginContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 40px 20px;
`;

const LoginFormWrapper = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
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
  transition: border-color var(--transition-speed);

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const AltOption = styled.p`
  margin-top: 25px;
  color: var(--text-dark);
  a {
    font-weight: 600;
    text-decoration: underline;
  }
`;

// --- Component ---

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to the page the user was on before, or default to the account page
  const from = location.state?.from?.pathname || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    
    const result = await login(email, password);
    
    setLoading(false);

    if (result.success) {
      toast.success('Logged in successfully!');
      // If the user is an admin, redirect them to the admin dashboard
      if (result.user && result.user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
    // Error toasts are handled within the AuthContext's login function
  };

  return (
    <LoginContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <LoginFormWrapper
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FormTitle>Welcome Back!</FormTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </FormGroup>
          <SubmitButton
            type="submit"
            whileTap={buttonClick}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </SubmitButton>
        </form>
        <AltOption>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </AltOption>
      </LoginFormWrapper>
    </LoginContainer>
  );
}

export default Login;
