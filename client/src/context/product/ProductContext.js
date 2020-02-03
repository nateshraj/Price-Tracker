import React, { createContext, useReducer } from 'react';
import productReducer from './productReducer';
import axios from 'axios';

export const ProductContext = createContext();

const ProductContextProvider = (props) => {
  const initialState = {
    products: [],
    current: null,
    filtered: null,
    error: null
  };

  const [state, dispatch] = useReducer(productReducer, initialState);

  const getProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      dispatch({ type: 'GET_PRODUCTS', payload: res.data });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.msg });
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
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.msg });
    }
  }

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      dispatch({ type: 'DELETE_PRODUCT', payload: id });

    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.msg });
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
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.msg });
    }
  }

  const refreshPrices = async () => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      await axios.get('/api/products/refresh', config);
      // const res = await axios.get('/api/products/refresh', config);
      // dispatch({ type: 'REFRESH_PRICES', payload: res.data });
    } catch (e) {
      dispatch({ type: 'PRODUCT_ERROR', payload: e.response.msg });
    }
  }


  const clearProducts = (id) => {
    dispatch({ type: 'CLEAR_PRODUCTS' });
  }

  const setCurrent = (product) => {
    dispatch({ type: 'SET_CURRENT', payload: product });
  }

  const clearCurrent = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  }

  const filterProducts = (text) => {
    dispatch({ type: 'FILTER_PRODUCTS', payload: text });
  }

  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  }

  return (
    <ProductContext.Provider value={{
      products: state.products, current: state.current, filtered: state.filtered, error: state.error, addProduct, deleteProduct, setCurrent, clearCurrent,
      filterProducts, clearFilter, getProducts, clearProducts, updateTargetPrice, refreshPrices
    }}>
      {props.children}
    </ProductContext.Provider>
  )
}

export default ProductContextProvider;
