import React, { useContext } from 'react'
import { makeStyles, Card, CardContent, Typography, Button, CardActions, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import flipkart from '../../img/flipkart.png'
import amazon from '../../img/amazon.png'
import { ProductContext } from '../../context/product/ProductContext';

const useStyles = makeStyles({
  card: {
    maxWidth: 400,
    border: 'solid 1.5px'
  },
  body: {
    alignSelf: "end",
    textAlign: "center"
  },
  media: {
    height: 140,
  },
  imgFlipkart: {
    width: '4vh'
  },
  imgAmazon: {
    width: '5vh'
  }
});

const ProductItem = ({ product }) => {
  const classes = useStyles();

  const productContext = useContext(ProductContext);
  const { updateTargetPrice, deleteProduct } = productContext;

  const { _id, name, price, targetPrice, link } = product;

  const [values, setValues] = React.useState({
    dialogOpen: false,
    targetPrice: targetPrice
  });

  const { dialogOpen } = values;

  const toggleDialog = () => setValues({ ...values, dialogOpen: !values.dialogOpen, targetPrice: targetPrice });

  const handleChange = e => setValues({ ...values, [e.target.name]: e.target.value });

  const handleDialogSubmit = (e) => {
    e.preventDefault();
    if (values.targetPrice !== targetPrice) {
      updateTargetPrice(_id, values.targetPrice);
      toggleDialog();
    } else {
      toggleDialog();
    }
  };

  const handleDelete = () => {
    deleteProduct(_id);
  }

  return (
    <Grid item style={{ padding: 5 }} md={2}>
      <Card className={classes.card}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="h6" component="p">
            Current Price: {price} <br />
            {targetPrice && `Target Price: ₹ ${targetPrice}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" color="primary" onClick={toggleDialog}>
            Edit Target
          </Button>
          <Button size="small" color="primary" onClick={handleDelete}>
            Delete
          </Button>
          <Button href={link} target="_blank">
            {link.includes('amazon.in') ? (<img src={amazon} className={classes.imgAmazon} alt="Amazon" />) : (<img src={flipkart} className={classes.imgFlipkart} alt="Flipkart" />)}
          </Button>
        </CardActions>
      </Card>

      <Dialog open={dialogOpen} onClose={toggleDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Target Price</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You will be notified when the product is at or below your target price.
          </DialogContentText>
          <form id="editTargetPriceForm" onSubmit={handleDialogSubmit}>
            <TextField id="outlined-full-width" label="Target Price" fullWidth variant="outlined" margin="normal" name="targetPrice" value={values.targetPrice} onChange={handleChange} type="number" required />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDialog} color="primary">
            Cancel
          </Button>
          <Button type="submit" form="editTargetPriceForm" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </Grid>
  )
}

export default ProductItem;