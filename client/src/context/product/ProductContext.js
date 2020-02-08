import React, { createContext, useReducer } from 'react';
import productReducer from './productReducer';
import axios from 'axios';

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const initialState = {
    products: [],
    error: null
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      dispatch({ type: 'GET_PRODUCTS', payload: res.data });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: 'Unable to load products. Please try again later' });
    }
  }

  const addProduct = async (product) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const res = await axios.post('/api/products', product, config);
      dispatch({ type: 'ADD_PRODUCT', payload: res.data });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.data });
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: 'Unable to delete product. Please try again later' });
    }
  }

  const updateTargetPrice = async (id, targetPrice) => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const res = await axios.put(`/api/products/${id}`, { targetPrice }, config);
      dispatch({ type: 'UPDATE_TARGETPRICE', payload: res.data });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: 'Unable to update product. Please try again later' });
    }
  }

  const refreshPrices = async () => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      await axios.get('/api/products/refresh', config);
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: 'Unable to refresh products. Please try again later' });
    }
  }

  const clearProducts = (id) => {
    dispatch({ type: 'CLEAR_PRODUCTS' });
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  }

  return (
    <ProductContext.Provider value={{
      products: state.products, error: state.error, addProduct, deleteProduct,
      getProducts, clearProducts, updateTargetPrice, refreshPrices, clearError
    }}>
      {props.children}
    </ProductContext.Provider>
  )
}

export default ProductContextProvider;
