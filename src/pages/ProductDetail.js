// src/pages/ProductDetail.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaStar, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Context and Utilities ---
import { useCart } from '../contexts/CartContext';
import { pageTransition, buttonClick } from '../utils/animations';

// --- Styled Components ---

const ProductDetailContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const BackButton = styled(motion.button)`
  background: none;
  border: 1px solid var(--border-color);
  color: var(--primary-color);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 30px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all var(--transition-speed);

  &:hover {
    background-color: var(--input-bg);
    transform: translateX(-5px);
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  gap: 50px;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const ProductGallery = styled.div`
  flex: 1;
`;

const MainImage = styled(motion.div)`
  width: 100%;
  height: 500px;
  background-color: var(--dark-card-bg);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    height: 350px;
  }
`;

const ProductInfo = styled.div`
  flex: 1;
  padding: 10px 0;
`;

const ProductTitle = styled.h1`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 20px;
  line-height: 1.2;
`;

const ProductPrice = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--accent-color);
  margin-bottom: 20px;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;

  .stars {
    display: flex;
    gap: 4px;
    color: #ffc107;
    font-size: 1.2rem;
  }

  .reviews-count {
    color: var(--text-dark);
    font-size: 1rem;
  }
`;

const ProductDescription = styled.p`
  color: var(--text-light);
  margin-bottom: 30px;
  line-height: 1.7;
  font-size: 1.1rem;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;

  label {
    font-size: 1.1rem;
    font-weight: 500;
  }

  input {
    width: 70px;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background-color: var(--input-bg);
    color: var(--text-light);
    text-align: center;
    font-size: 1.1rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled(motion.button)`
  flex: 1;
  background-color: var(--primary-color);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ReviewsSection = styled.div`
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid var(--border-color);

  h3 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 30px;
  }
`;

const ReviewItem = styled.div`
  background-color: var(--dark-card-bg);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--border-color);

  .review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .review-author {
    font-weight: 600;
    color: var(--text-light);
    font-size: 1.1rem;
  }

  .review-date {
    color: var(--text-dark);
    font-size: 0.85rem;
  }
`;

// --- Component ---

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Dummy reviews for demonstration
  const [reviews] = useState([
    { id: 1, author: 'Ramesh', date: '2023-05-15', rating: 5, text: 'Excellent product quality and fast delivery!' },
    { id: 2, author: 'Suresh', date: '2023-04-22', rating: 4, text: 'Good material but the size was slightly smaller than expected.' }
  ]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Product not found or there was an error loading it.');
        toast.error('Could not load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity);
    navigate('/checkout');
  };

  if (loading) {
    return <ProductDetailContainer><p style={{ textAlign: 'center' }}>Loading product details...</p></ProductDetailContainer>;
  }
  if (error) {
    return <ProductDetailContainer><p style={{ textAlign: 'center', color: 'red' }}>{error}</p></ProductDetailContainer>;
  }
  if (!product) {
    return <ProductDetailContainer><p style={{ textAlign: 'center' }}>Product not found.</p></ProductDetailContainer>;
  }

  return (
    <ProductDetailContainer
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <BackButton onClick={() => navigate(-1)} whileTap={buttonClick}>
        <FaArrowLeft /> Back
      </BackButton>

      <ProductWrapper>
        <ProductGallery>
          <MainImage>
            <img src={product.image_url} alt={product.name} />
          </MainImage>
        </ProductGallery>

        <ProductInfo>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductPrice>₹{product.price.toFixed(2)}</ProductPrice>

          <ProductRating>
            <div className="stars">
              {[...Array(5)].map((_, i) => (i < 4 ? <FaStar key={i} /> : <FaRegStar key={i} />))}
            </div>
            <span className="reviews-count">({reviews.length} reviews)</span>
          </ProductRating>

          <ProductDescription>{product.description}</ProductDescription>

          <QuantitySelector>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
            />
            <span style={{color: 'var(--text-dark)', fontSize: '0.9rem'}}>({product.stock_quantity} in stock)</span>
          </QuantitySelector>
          
          <ActionButtons>
            <PrimaryButton onClick={handleBuyNow} whileTap={buttonClick} disabled={product.stock_quantity === 0}>
              Buy Now
            </PrimaryButton>
            <PrimaryButton onClick={handleAddToCart} whileTap={buttonClick} disabled={product.stock_quantity === 0} style={{backgroundColor: 'var(--secondary-color)'}}>
              <FaShoppingCart /> Add to Cart
            </PrimaryButton>
          </ActionButtons>
        </ProductInfo>
      </ProductWrapper>

      <ReviewsSection>
        <h3>Customer Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.id}>
              <div className="review-header">
                <span className="review-author">{review.author}</span>
                <div className="stars">
                    {[...Array(5)].map((_, i) => (i < review.rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}
                </div>
                <span className="review-date">{review.date}</span>
              </div>
              <p className="review-text">{review.text}</p>
            </ReviewItem>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-dark)' }}>No reviews yet for this product.</p>
        )}
      </ReviewsSection>
    </ProductDetailContainer>
  );
}

export default ProductDetail;
