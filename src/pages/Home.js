// src/pages/Home.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Local Asset Imports ---
// IMPORTANT: Create an 'assets' folder inside your 'src' folder
// and place your desired hero image named 'home_image.png' there.
import homeImage from '../assets/home_image.png';

// --- Context and Utilities ---
import { useCart } from '../contexts/CartContext';
import { pageTransition, fadeIn, itemHover, buttonClick, scribbleAnimation } from '../utils/animations';


// --- Styled Components ---

const HomeContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const HeroSection = styled(motion.section)`
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--dark-card-bg) 100%);
  border-radius: 20px;
  padding: 60px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
  }
`;

const HeroText = styled(motion.div)`
  flex: 1;
  z-index: 2;
  h1 {
    font-size: 3.5rem;
    color: var(--primary-color);
    line-height: 1.1;
    margin-bottom: 20px;
    span {
      font-family: 'Permanent Marker', cursive;
      color: var(--text-light);
    }
  }
  p {
    font-size: 1.2rem;
    color: var(--text-dark);
    margin-bottom: 30px;
    max-width: 500px;
    @media (max-width: 992px) {
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const CallToActionButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(var(--primary-color-rgb), 0.3);
`;

const HeroImage = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  img {
    max-width: 450px;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
  }
  @media (max-width: 992px) {
    margin-top: 40px;
  }
`;

const ScribbleArt = styled(motion.svg)`
  position: absolute;
  top: ${props => props.top || 'unset'};
  bottom: ${props => props.bottom || 'unset'};
  left: ${props => props.left || 'unset'};
  right: ${props => props.right || 'unset'};
  width: ${props => props.width || '150px'};
  height: auto;
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 3px;
  filter: drop-shadow(0 0 5px var(--primary-color));
  z-index: 1;
  opacity: 0.6;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 50px;
  color: var(--primary-color);
  span {
    font-family: 'Permanent Marker', cursive;
    color: var(--text-light);
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 80px;
`;

const ProductCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-speed);
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
`;

const ProductInfo = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  text-align: left;
  h3 {
    font-size: 1.4rem;
    margin-bottom: 10px;
    color: var(--text-light);
    cursor: pointer;
  }
  p {
    color: var(--text-dark);
    font-size: 0.9rem;
    margin-bottom: 15px;
    flex-grow: 1;
  }
  span {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
    margin-bottom: 20px;
  }
`;

const ActionButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const CategorySection = styled(motion.section)`
  margin-bottom: 60px;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
`;

const CategoryCard = styled(motion.div)`
  background: var(--dark-card-bg);
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  border: 1px solid var(--border-color);
  transition: all var(--transition-speed);

  a {
    display: block;
    padding: 30px 20px;
    color: var(--text-light);
    font-size: 1.5rem;
    font-weight: 700;
  }

  &:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    background: var(--secondary-color);
  }
`;

// --- Component ---

function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        // Take the first 4 products as featured products
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching products for Home page:', err);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    addToCart(product.id, 1);
    navigate('/checkout');
    toast.success(`${product.name} added to cart! Redirecting to checkout.`);
  };

  return (
    <HomeContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <HeroSection>
        <ScribbleArt top="20px" left="10px" variants={scribbleAnimation} initial="initial" animate="draw">
          <path d="M10 30 Q 50 10, 100 30 T 190 20" />
        </ScribbleArt>
        <HeroText initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <h1>Discover the <span>Essence</span> of Tulunad</h1>
          <p>Explore our exclusive collection of merchandise, shirts, and shawls for men, women, and kids, rooted in the vibrant Tulunad culture of Karnataka, India.</p>
          <Link to="/categories">
            <CallToActionButton whileHover={{ scale: 1.05 }} whileTap={buttonClick}>
              Shop Now
            </CallToActionButton>
          </Link>
        </HeroText>
        <HeroImage initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}>
          <img src={homeImage} alt="Tulunad Culture Merchandise" />
        </HeroImage>
      </HeroSection>

      <SectionTitle variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }}>
        Featured <span>Products</span>
      </SectionTitle>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading products...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : (
        <ProductGrid>
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.3 + index * 0.1 }}>
              <ProductImage src={product.image_url} alt={product.name} onClick={() => navigate(`/products/${product.id}`)} />
              <ProductInfo>
                <div>
                  <h3 onClick={() => navigate(`/products/${product.id}`)}>{product.name}</h3>
                  <p>{product.description.substring(0, 80)}...</p>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
                <ActionButton onClick={() => handleBuyNow(product)} whileTap={buttonClick} disabled={product.stock_quantity === 0}>
                  <FaShoppingCart /> {product.stock_quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                </ActionButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      )}

      <SectionTitle variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 }}>
        Explore Our <span>Categories</span>
      </SectionTitle>
      <CategorySection>
        <CategoryGrid>
          {['Men', 'Women', 'Kids', 'Shawls', 'Customized'].map((category, index) => (
            <CategoryCard key={category} whileHover={{ ...itemHover.hover, backgroundColor: '#457b9d' }} variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true, amount: 0.5 + index * 0.1 }}>
              <Link to={`/categories?category=${category.toLowerCase()}`}>
                {category}
              </Link>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </CategorySection>
    </HomeContainer>
  );
}

export default Home;
