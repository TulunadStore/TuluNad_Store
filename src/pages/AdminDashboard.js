// src/pages/AdminDashboard.js

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

// --- Context and Utils ---
import { useAuth } from '../contexts/AuthContext';
import { pageTransition, buttonClick } from '../utils/animations';

// --- Styled Components ---

const DashboardContainer = styled(motion.div)`
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  margin-bottom: 30px;
  color: var(--primary-color);
`;

const Controls = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  gap: 15px;
`;

const ControlButton = styled(motion.button)`
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background-color: var(--primary-color);
  color: white;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  background-color: var(--dark-card-bg);
  padding: 20px;
  border-radius: 15px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  th {
    color: var(--primary-color);
  }
  td img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  margin-right: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  &.edit { background-color: var(--secondary-color); color: white; }
  &.delete { background-color: var(--danger-color); color: white; }
`;

// --- Form Modal Styles ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContent = styled(motion.div)`
  background: var(--dark-card-bg);
  padding: 40px;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  border: 1px solid var(--primary-color);
`;

// --- Component ---

function AdminDashboard() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId) => {
    toast((t) => (
        <div>
          <p>Are you sure you want to delete this product?</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(`${API_BASE_URL}/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  toast.success("Product deleted!");
                  fetchProducts();
                } catch (error) {
                  toast.error("Failed to delete product.");
                }
              }}
              style={{flex: 1, padding: '8px', border: 'none', background: 'var(--danger-color)', color: 'white'}}
            >
              Delete
            </button>
            <button onClick={() => toast.dismiss(t.id)} style={{flex: 1}}>Cancel</button>
          </div>
        </div>
      ), { duration: 6000 });
  };

  return (
    <DashboardContainer variants={pageTransition} initial="initial" animate="animate" exit="exit">
      <PageTitle>Admin Dashboard</PageTitle>
      <Controls>
        <ControlButton onClick={handleAddClick} whileTap={buttonClick}>Add New Product</ControlButton>
      </Controls>

      {loading ? <p>Loading products...</p> : (
        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><img src={p.image_url} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>₹{p.price.toFixed(2)}</td>
                  <td>{p.stock_quantity}</td>
                  <td>
                    <ActionButton className="edit" onClick={() => handleEditClick(p)}>Edit</ActionButton>
                    <ActionButton className="delete" onClick={() => handleDelete(p.id)}>Delete</ActionButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <ProductFormModal
            product={editingProduct}
            onClose={() => setIsFormOpen(false)}
            onSave={fetchProducts}
            token={token}
          />
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
}

// --- Product Form Modal Component ---
const ProductFormModal = ({ product, onClose, onSave, token }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || '',
        stock_quantity: product?.stock_quantity || '',
        category: product?.category || ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const API_BASE_URL = 'http://localhost:5000/api';

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const postData = new FormData();
        Object.keys(formData).forEach(key => postData.append(key, formData[key]));
        if (imageFile) {
            postData.append('image', imageFile);
        }

        try {
            if (product) { // Update
                await axios.put(`${API_BASE_URL}/products/${product.id}`, postData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                });
                toast.success("Product updated!");
            } else { // Create
                await axios.post(`${API_BASE_URL}/products`, postData, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                });
                toast.success("Product created!");
            }
            onSave();
            onClose();
        } catch (error) {
            toast.error("Operation failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalOverlay initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} onClick={onClose}>
            <ModalContent initial={{y: 50}} animate={{y: 0}} exit={{y: 50}} onClick={e => e.stopPropagation()}>
                <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required />
                    <input name="stock_quantity" type="number" value={formData.stock_quantity} onChange={handleChange} placeholder="Stock" required />
                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
                    <input type="file" onChange={e => setImageFile(e.target.files[0])} />
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
};

export default AdminDashboard;
