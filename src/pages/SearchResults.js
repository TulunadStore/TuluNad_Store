// src/pages/SearchResults.js

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
// CORRECTED IMPORT: Removed itemCardVariants, now only importing what's available
import { pageTransition, itemHover } from '../utils/animations'; // Assuming itemHover is an object with hover/tap properties

const SearchResultsContainer = styled(motion.div)`
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--text-light);
  text-align: center;
`;

const PageTitle = styled.h1`
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  color: var(--primary-color);
  margin-bottom: 30px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  justify-items: center;
  margin-top: 40px;
`;

const ProductCard = styled(motion.div)`
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  text-align: left;
  transition: transform var(--transition-speed), box-shadow var(--transition-speed);
  width: 100%; /* Ensure cards take full grid column width */
  max-width: 300px; /* Max width for individual cards */
  cursor: pointer; /* Indicate clickability */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
`;

const ProductCardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid var(--border-color);
`;

const ProductCardContent = styled.div`
  padding: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductCardName = styled.h3`
  font-size: 1.4rem;
  color: var(--primary-color);
  margin-bottom: 10px;
  height: 2.8em; /* Limit height for name */
  overflow: hidden;
`;

const ProductCardPrice = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--accent-color);
  margin-bottom: 15px;
`;

const NoResultsMessage = styled.p`
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-top: 50px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: var(--text-light);
  text-align: center;
  padding: 50px 0;
`;

const ErrorMessage = styled(Message)`
  color: #ff6b6b;
`;

function SearchResults() {
  const location = useLocation(); // To get query parameters
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchTerm = new URLSearchParams(location.search).get('query') || '';

  // Fetch all products initially
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products for search.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching all products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []); // Run once on mount

  // Filter products whenever searchTerm or products change
  useEffect(() => {
    if (searchTerm && products.length > 0) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const results = products.filter(product =>
        product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.description?.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.category?.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]); // No search term, no results
    }
  }, [searchTerm, products]);

  const handleProductClick = (id) => {
    navigate(`/products/${id}`);
  };

  if (loading) {
    return <Message>Searching...</Message>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <SearchResultsContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <PageTitle>Search Results for "{searchTerm}"</PageTitle>

      {filteredProducts.length === 0 && searchTerm ? (
        <NoResultsMessage>No products found matching your search.</NoResultsMessage>
      ) : filteredProducts.length === 0 && !searchTerm ? (
        <NoResultsMessage>Please enter a search term in the header.</NoResultsMessage>
      ) : (
        <ProductGrid>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              // CORRECTED: Using itemHover properties directly
              whileHover={itemHover.hover}
              whileTap={itemHover.tap}
              onClick={() => handleProductClick(product.id)}
            >
              <ProductCardImage
                src={product.image_url || 'https://placehold.co/300x200/cccccc/333333?text=No+Image'}
                alt={product.name}
              />
              <ProductCardContent>
                <ProductCardName>{product.name}</ProductCardName>
                <ProductCardPrice>₹{product.price ? product.price.toFixed(2) : 'N/A'}</ProductCardPrice>
                {/* You might add a short description or category here */}
              </ProductCardContent>
            </ProductCard>
          ))}
        </ProductGrid>
      )}
    </SearchResultsContainer>
  );
}

export default SearchResults;
