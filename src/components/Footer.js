// src/components/Footer.js

import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { fadeIn } from '../utils/animations';

// --- Styled Components ---

const StyledFooter = styled(motion.footer)`
  background-color: var(--dark-card-bg);
  color: var(--text-light);
  padding: 50px 20px;
  border-top: 1px solid var(--border-color);
  font-size: 0.9rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  text-align: left;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: var(--primary-color);
    margin-bottom: 20px;
    font-size: 1.3rem;
  }

  p {
    color: var(--text-dark);
    line-height: 1.7;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: var(--text-dark);
    text-decoration: none;
    transition: color var(--transition-speed);

    &:hover {
      color: var(--primary-color);
      text-decoration: underline;
    }
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    color: var(--text-dark);
    font-size: 1.5rem;
    transition: color var(--transition-speed), transform var(--transition-speed);

    &:hover {
      color: var(--primary-color);
      transform: translateY(-3px);
    }
  }
`;

const Copyright = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color-light);
  color: var(--text-dark);
  text-align: center;
  font-size: 0.85rem;
`;

// --- Component ---

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <StyledFooter
      variants={fadeIn}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
    >
      <FooterContent>
        <FooterSection>
          <h3>Tulunad Store</h3>
          <p>Discover authentic merchandise inspired by the vibrant culture of Tulunad, Karnataka.</p>
          <SocialIcons>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube /></a>
          </SocialIcons>
        </FooterSection>

        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/categories">Products</Link></li>
            <li><Link to="/cart">My Cart</Link></li>
            <li><Link to="/account">My Account</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
          <h3>Customer Service</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </FooterSection>

        <FooterSection>
            <h3>Contact Us</h3>
            <p>
                Email: support@tulunadstore.com<br/>
                Phone: +91 12345 67890<br/>
                Address: Mangalore, Karnataka, India
            </p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        &copy; {currentYear} Tulunad Store. All Rights Reserved.
      </Copyright>
    </StyledFooter>
  );
}

export default Footer;
