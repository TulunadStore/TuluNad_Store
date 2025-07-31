// src/pages/Signup.js

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- Context and Utilities ---
// CORRECTED: Import AuthContext directly, not the useAuth hook for class components
import { AuthContext } from '../contexts/AuthContext';
import { pageTransition, buttonClick } from '../utils/animations';

// --- Styled Components ---

const SignupContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 40px 20px;
`;

const SignupFormWrapper = styled(motion.div)`
  background-color: var(--dark-card-bg);
  padding: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 500px;
  border: 1px solid var(--border-color);
  text-align: center;
`;

const FormTitle = styled.h2`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
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

class Signup extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    loading: false,
  };

  // CORRECTED: Assign the AuthContext itself, not the hook
  static contextType = AuthContext;

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = this.state;
    
    // CORRECTED: Access the signup function directly from this.context
    const { signup } = this.context;
    const { navigate } = this.props;

    // Client-side validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return toast.error('All fields are required.');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match.');
    }

    this.setState({ loading: true });

    const result = await signup({ firstName, lastName, email, password });

    this.setState({ loading: false });

    if (result.success) {
      navigate('/login');
    }
  };

  render() {
    const { loading } = this.state;
    
    return (
      <SignupContainer
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
      >
        <SignupFormWrapper
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FormTitle>Create Your Account</FormTitle>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label htmlFor="firstName">First Name</Label>
              <Input type="text" name="firstName" onChange={this.handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="lastName">Last Name</Label>
              <Input type="text" name="lastName" onChange={this.handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" name="email" onChange={this.handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" onChange={this.handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input type="password" name="confirmPassword" onChange={this.handleChange} required />
            </FormGroup>
            <SubmitButton type="submit" whileTap={buttonClick} disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </SubmitButton>
          </form>
          <AltOption>
            Already have an account? <Link to="/login">Login here</Link>
          </AltOption>
        </SignupFormWrapper>
      </SignupContainer>
    );
  }
}

// Higher-Order Component to inject the navigate function into the class component
function WithRouter(props) {
  const navigate = useNavigate();
  return <Signup {...props} navigate={navigate} />;
}

export default WithRouter;
