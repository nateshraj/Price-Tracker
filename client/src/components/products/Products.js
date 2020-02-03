import React, { useEffect, useContext, Fragment } from 'react';
import Navbar from '../layouts/Appbar';
import ProductItem from './ProductItem';
import { Typography, Grid, Fab, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { AuthContext } from '../../context/auth/AuthContext';
import { ProductContext } from '../../context/product/ProductContext';
import socketIOClient from 'socket.io-client';
import Warning from '../layouts/Warning';


const Products = () => {
  const buttonStyle = {
    margin: 0,
    top: 'auto',
    right: 30,
    bottom: 30,
    left: 'auto',
    position: 'fixed',
  };

  const authContext = useContext(AuthContext);
  const { user, loadUser } = authContext;

  const productContext = useContext(ProductContext);
  const { products, addProduct, getProducts } = productContext;

  useEffect(() => {
    try {
      const socket = socketIOClient('http://localhost:5000/');
      socket.on('updatedEmail', () => {
        loadUser();
      });
      socket.on('updatedProducts', () => {
        getProducts();
      });
    } catch (e) {
      console.log('Unable to connect to socket');
    }
    loadUser();
    getProducts();
    // eslint-disable-next-line
  }, []);

  const [values, setValues] = React.useState({
    dialogOpen: false,
    productLink: '',
    targetPrice: ''
  });

  const { dialogOpen, productLink, targetPrice } = values;

  // const handleClickOpen = () => setValues({ ...values, dialogOpen: true });
  // const handleClose = () => setValues({ ...values, dialogOpen: false });

  const toggleDialog = () => setValues({ ...values, dialogOpen: !values.dialogOpen, productLink: '', targetPrice: '' });

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    targetPrice !== '' ? addProduct({ link: productLink, targetPrice }) : addProduct({ link: productLink });
    toggleDialog();
  };

  return (
    <div>
      <Navbar />
      <br />
      {user && !user.isVerified ? (<Warning />) :

        (<Fragment>
          <br />
          <Typography gutterBottom variant="h4" align="center" >
            Products
          </Typography>
          <br />

          <Grid container spacing={2} justify="center">

            {/* <Grid item md={4} > */}
            {products.map(product => <ProductItem product={product} key={product._id} />)}
            {/* </Grid> */}

            {/* <Grid item md={2} >
          <ProductItem />
        </Grid> */}

          </Grid>
        </Fragment>)}
      {user && !user.isVerified ? (
        <Fab color="primary" style={buttonStyle} aria-label="add" onClick={toggleDialog} disabled >
          <AddIcon />
        </Fab>
      ) : (
          <Fab color="primary" style={buttonStyle} aria-label="add" onClick={toggleDialog} >
            <AddIcon />
          </Fab>
        )}
      {/* <Fab color="primary" style={buttonStyle} aria-label="add" onClick={toggleDialog} >
        <AddIcon />
      </Fab> */}
      <Dialog open={dialogOpen} onClose={toggleDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please add the links of products from Flipkart and Amazon. You will be notified when the product is at or below your target price.
          </DialogContentText>
          <form id="productForm" onSubmit={handleSubmit}>
            <TextField id="outlined-full-width" autoFocus label="Product Link" fullWidth variant="outlined" margin="normal" name="productLink" value={productLink} onChange={handleChange} type="url" required />
            <TextField id="outlined-full-width" label="Target Price (Optional)" fullWidth variant="outlined" margin="normal" name="targetPrice" value={targetPrice} onChange={handleChange} type="number" />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="productForm" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>



    </div>
  )
}

export default Products
