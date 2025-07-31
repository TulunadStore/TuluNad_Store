// src/pages/Categories.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaShoppingCart } from 'react-icons/fa';

// --- Context and Utilities ---
import { useCart } from '../contexts/CartContext';
import { pageTransition, fadeIn, itemHover, buttonClick } from '../utils/animations';

// --- Styled Components ---

const CategoriesContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageTitle = styled(motion.h1)`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 40px;
  color: var(--primary-color);
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 50px;
`;

const FilterButton = styled(motion.button)`
  background-color: ${props => props.$active ? 'var(--primary-color)' : 'var(--input-bg)'};
  color: ${props => props.$active ? 'white' : 'var(--text-light)'};
  padding: 10px 25px;
  border: 1px solid ${props => props.$active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-speed);
  box-shadow: ${props => props.$active ? '0 4px 15px rgba(var(--primary-color-rgb), 0.4)' : 'none'};

  &:hover {
    background-color: var(--hover-effect);
    border-color: var(--hover-effect);
    color: white;
    transform: translateY(-2px);
  }
`;

const ProductGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
`;

const ProductCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: all var(--transition-speed);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
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
    color: var(--text-light);
    margin-bottom: 10px;
    cursor: pointer;
  }
  p {
    font-size: 0.95rem;
    color: var(--text-dark);
    margin-bottom: 15px;
    flex-grow: 1;
  }
  span {
    font-size: 1.5rem;
    color: var(--primary-color);
    font-weight: 700;
    margin-top: 10px;
    display: block;
  }
`;

const ActionButton = styled(motion.button)`
  background-color: var(--primary-color);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  transition: all var(--transition-speed);

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: var(--hover-effect);
    transform: translateY(-2px);
  }
`;

const NoProductsMessage = styled(motion.p)`
  text-align: center;
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-top: 50px;
  padding: 40px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
`;

// --- Component ---

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryFilter = searchParams.get('category') || 'all';
  const searchTerm = searchParams.get('search') || '';

  const allFilterCategories = ['all', 'men', 'women', 'kids', 'shawls', 'customized'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterClick = (category) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', category);
    }
    setSearchParams(newSearchParams);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category?.toLowerCase() === categoryFilter;
    const matchesSearch = searchTerm === '' ||
                          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleBuyNow = (product) => {
    addToCart(product.id, 1);
    navigate('/checkout');
  };

  return (
    <CategoriesContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageTitle variants={fadeIn}>Our Products</PageTitle>

      <FilterContainer>
        {allFilterCategories.map(category => (
          <FilterButton
            key={category}
            onClick={() => handleFilterClick(category)}
            $active={categoryFilter === category}
            whileTap={buttonClick}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading products...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
      ) : filteredProducts.length > 0 ? (
        <ProductGrid>
          {filteredProducts.map(product => (
            // CORRECTED: Added initial, whileInView, and viewport props to trigger the animation correctly.
            <ProductCard 
              key={product.id} 
              variants={fadeIn} 
              whileHover={itemHover}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <ProductImage src={product.image_url} alt={product.name} onClick={() => navigate(`/products/${product.id}`)} />
              <ProductInfo>
                <div>
                  <h3 onClick={() => navigate(`/products/${product.id}`)}>{product.name}</h3>
                  <p>{product.description ? product.description.substring(0, 80) + '...' : ''}</p>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
                <ActionButton
                  onClick={() => handleBuyNow(product)}
                  whileTap={buttonClick}
                  disabled={product.stock_quantity === 0}
                >
                  <FaShoppingCart /> {product.stock_quantity > 0 ? 'Buy Now' : 'Out of Stock'}
                </ActionButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductGrid>
      ) : (
        <NoProductsMessage variants={fadeIn}>
          {searchTerm ? `No products found matching "${searchTerm}".` : 'No products found in this category.'}
        </NoProductsMessage>
      )}
    </CategoriesContainer>
  );
}

export default Categories;
