import React, { createContext, useReducer } from 'react';
import authReducer from './authReducer';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    setAuthToken(localStorage.token);
    try {
      const res = await axios.get('/api/user');
      await dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (e) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }

  const register = async formData => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const res = await axios.post('/api/register', formData, config);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      loadUser();
    } catch (e) {
      dispatch({ type: 'REGISTER_FAIL', payload: e.response.data.msg });
    }
  }

  const login = async formData => {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    try {
      const res = await axios.post('/api/login', formData, config);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      loadUser();
    } catch (e) {
      dispatch({ type: 'LOGIN_FAIL', payload: e.response.data.msg });
    }
  }

  const logout = () => { dispatch({ type: 'LOGOUT' }) };

  return (
    <AuthContext.Provider value={{
      token: state.token, isAuthenticated: state.isAuthenticated, loading: state.loading, user: state.user, error: state.error, register, loadUser, login, logout
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;