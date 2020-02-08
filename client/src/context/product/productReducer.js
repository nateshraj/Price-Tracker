export default (state, action) => {
  switch (action.type) {
    case 'GET_PRODUCTS':
      return { ...state, products: action.payload, loading: false };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload], loading: false };
    case 'UPDATE_TARGETPRICE':
      return { ...state, products: state.products.map(product => product._id === action.payload._id ? action.payload : product), loading: false };
    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(product => product._id !== action.payload), loading: false };
    case 'CLEAR_PRODUCTS':
      return { ...state, products: null, error: null }
    case 'PRODUCT_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}