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
    // if (localStorage.token) {
    //   setAuthToken(localStorage.token);
    // }
    setAuthToken(localStorage.token);
    try {
      const res = await axios.get('/api/user');
      // console.log('$$$');
      // console.log(res.data);
      // console.log('$$$');
      await dispatch({ type: 'USER_LOADED', payload: res.data });
      // console.log('--');
      // console.log(state);
      // console.log('--');
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

  // Not needed mostly
  // const verify = () => { dispatch({ type: 'VERIFY_EMAIL' }); }

  return (
    <AuthContext.Provider value={{
      token: state.token, isAuthenticated: state.isAuthenticated, loading: state.loading, user: state.user, error: state.error, register, loadUser, login, logout
    }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;
