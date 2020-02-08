import React from 'react';
import './App.css';
import Landing from './components/pages/Landing';
import Products from './components/products/Products';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthContextProvider from './context/auth/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import ProductContextProvider from './context/product/ProductContext';
import Verify from './components/pages/Verify';
import Reset from './components/pages/Reset';

function App() {
  return (
    <AuthContextProvider>
      <ProductContextProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' >
              <Redirect to='/register' />
            </Route>
            <Route exact path='/register' render={props => <Landing {...props} componentToLoad='register' />} />
            <Route exact path='/login' render={props => <Landing {...props} componentToLoad='login' />} />
            <PrivateRoute exact path='/products' component={Products} />
            <Route exact path='/verify/:verificationToken' render={props => <Verify {...props} />} />
            <Route exact path='/reset/:resetToken' render={props => <Reset {...props} />} />
          </Switch>
        </BrowserRouter>
      </ProductContextProvider>
    </AuthContextProvider>
  );
}

export default App;