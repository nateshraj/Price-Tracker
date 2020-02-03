import React, { useContext, Fragment } from 'react';
import { AppBar, Typography, Toolbar, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/auth/AuthContext';
import { ProductContext } from '../../context/product/ProductContext';

const Appbar = () => {

  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout } = authContext;

  const productContext = useContext(ProductContext);
  const { refreshPrices } = productContext;

  // Need to clear products from the product context later

  const onLogout = () => {
    logout();
    // clearProducts();
  }

  return (
    <AppBar position="static" style={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography variant="h5" style={{ flexGrow: 1 }}>
          P₹ice Tracker
      </Typography>
        {isAuthenticated ? (
          <Fragment>
            <Button color="inherit" onClick={refreshPrices} >Refresh Prices</Button>
            <Button color="inherit" onClick={onLogout} >Logout</Button>
          </Fragment>
        ) : (
            <Fragment>
              <Button color="inherit" component={Link} to='/register'>Register</Button>
              <Button color="inherit" component={Link} to='/login'>Login</Button>
            </Fragment>
          )}
      </Toolbar>
    </AppBar>
  );
}

export default Appbar;
