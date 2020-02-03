import React, { useContext } from 'react'
import { makeStyles, Card, CardActionArea, CardContent, Typography, Button, CardActions, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@material-ui/core';
import flipkart from '../../img/flipkart.png'
import amazon from '../../img/amazon.png'
import { ProductContext } from '../../context/product/ProductContext';

const useStyles = makeStyles({
  card: {
    // display: "grid",
    // gridTemplateRows: "1fr auto",
    // gridGap: "8px",
    // alignSelf: "end",
    // textAlign: "center",
    maxWidth: 400,
    // maxWidth: 345,
    // height: "inherit"
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
    // margin: '100%',
    width: '50%',
    height: '30%',
    marginBottom: '2%'
    // flexGrow: 1,
    // alignSelf: 'right'
    // display: "flex",
    // justifyContent: "space-between"
  },
  imgAmazon: {
    // margin: '100%',
    width: '60%',
    height: '30%',
    marginBottom: '2%'
    // flexGrow: 1,
    // alignSelf: 'right'
    // display: "flex",
    // justifyContent: "space-between"
  },
  // test: {
  //   marginRight: '31%'
  // }
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
      console.log('edit');
      updateTargetPrice(_id, values.targetPrice);
      toggleDialog();
    } else {
      console.log('dont edit');
      toggleDialog();
    }
  };

  const handleDelete = () => {
    deleteProduct(_id);
    // clearCurrent();
  }

  return (
    // <Card className={classes.card}>
    //   <CardActionArea>
    //     {/* <CardMedia
    //         className={classes.media}
    //         image="/static/images/cards/contemplative-reptile.jpg"
    //         title="Contemplative Reptile"
    //       /> */}
    //     <CardContent>
    //       <Typography gutterBottom variant="h5" component="h2">
    //         Lenovo Legion Y540 9th Gen Core Intel I5 15.6 inch FHD Gaming Laptop (8GB RAM / 1TB HDD + 128 GB SSD / Windows 10 Home / 4GB NVIDIA GTX 1650 Graphics / Black / 2.3 Kg), 81SY00C3IN
    //       </Typography>
    //       <Typography variant="h6" component="p">
    //         Current Price: ₹62990 <br />
    //         Target Price: ₹60000
    //       </Typography>
    //     </CardContent>
    //   </CardActionArea>
    //   <CardActions>
    //     {/* <CardActions className={classes.test}> */}
    //     <Button size="small" color="primary">
    //       Delete
    //     </Button>
    //     <Button size="small" color="primary" className={classes.test}>
    //       Price History
    //     </Button>
    //     <img src={flipkart} className={classes.imgFlipkart} />
    //   </CardActions>
    // </Card>

    <Grid item md={2}>
      <Card className={classes.card}>
        <CardActionArea>
          {/* <CardMedia
            className={classes.media}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
          /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            <Typography variant="h6" component="p">
              Current Price: {price} <br />
              {/* Target Price: ₹60000 */}
              {targetPrice && `Target Price: ₹ ${targetPrice}`}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {/* <CardActions className={classes.test}> */}
          <Button size="small" color="primary">
            Price History
          </Button>
          <Button size="small" color="primary" onClick={toggleDialog}>
            Edit Target
          </Button>
          <Button size="small" color="primary" onClick={handleDelete}>
            Delete
          </Button>
          <Button href={link} target="_blank">
            {link.includes('amazon.in') ? (<img src={amazon} className={classes.imgAmazon} alt="Amazon" />) : (<img src={flipkart} className={classes.imgFlipkart} alt="Flipkart" />)}
          </Button>
          {/* {link.includes('amazon.in') ? (<Button href={link} target="_blank"><img src={amazon} className={classes.imgAmazon} /> </Button>)
            :
            (<img src={flipkart} className={classes.imgFlipkart} />)} */}
          {/* <img src={amazon} className={classes.imgAmazon} /> */}
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