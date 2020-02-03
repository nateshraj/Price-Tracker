
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
    // case 'REFRESH_PRICES':
    //   return {
    //     ...state, products: state.products.map(product => {
    //       const newProduct = action.payload.find(updatedProduct => updatedProduct._id === product._id);
    //       return newProduct ? newProduct : product;
    //     }), loading: false
    //   };
    case 'CLEAR_PRODUCTS':
      return { ...state, products: null, filtered: null, error: null, current: null }
    case 'SET_CURRENT':
      return { ...state, current: action.payload };
    case 'CLEAR_CURRENT':
      return { ...state, current: null };
    case 'FILTER_PRODUCTS':
      return {
        ...state, filtered: state.products.filter(product => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return product.name.match(regex);
        })
      };
    case 'CLEAR_FILTER':
      return { ...state, filtered: null };
    case 'CONTACT_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}