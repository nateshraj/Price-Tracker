const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productsController = require('../controllers/productsController');
const auth = require('../middleware/auth');

router.get('/products', auth, productsController.getProducts);

// router.post('/products', [auth, [
//   check('link', 'Product link is required').not().isEmpty().trim()
// ]], productsController.postProducts);

router.post('/products', [auth,
  check('link', 'Product link is required').not().isEmpty().trim(),
  check('targetPrice', 'Enter valid target price').optional().isNumeric()
], productsController.postProducts);

router.put('/products/:productId', [auth,
  check('targetPrice', 'Enter valid target price').isNumeric()
], productsController.putTargetPrice);

router.delete('/products/:productId', auth, productsController.deleteProducts);

router.get('/products/refresh', auth, productsController.getRefreshedPrices);

module.exports = router;