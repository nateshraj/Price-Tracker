export default (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return { ...state, isAuthenticated: true, loading: false, user: action.payload };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return { ...state, ...action.payload, isAuthenticated: true, loading: false };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      console.log('please');
      localStorage.removeItem('token');
      return { ...state, token: null, isAuthenticated: false, loading: false, user: null, error: action.payload };
    // Not needed mostly
    // case 'VERIFY_EMAIL':
    //   if (state.user) {
    //     const user = { ...state.user };
    //     user.isVerified = true;
    //     return { ...state, user };
    //   }
    default:
      return state;
  }
}