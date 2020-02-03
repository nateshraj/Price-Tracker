const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const axios = require('axios');
const cheerio = require('cheerio');
const sendgrid = require('@sendgrid/mail');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.id });
    res.json(products);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.postProducts = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { link, targetPrice } = req.body;
  try {
    const { name, price } = await getProductDetails(link);
    const newProduct = new Product({ name, price, link, targetPrice, user: req.id });
    const product = await newProduct.save();
    res.json(product);
    if (isBelowTarget(product)) {
      userProductsBelowTarget(req.id);
    }
    // res.json({name, price}); // To test response in postman
  } catch (e) {
    if (e.message === 'Enter Amazon or Flipkart product link') {
      // Verify and handle this in the frontend
      return res.status(400).json({ error: e.message });
    }
    console.log(e.message);
    return res.status(500).send('Server error');
  }
};

exports.putTargetPrice = async (req, res) => {
  try {

    const { targetPrice } = req.body;

    let product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.user.toString() !== req.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.productId,
      { targetPrice },
      { new: true }
    );

    res.json(product);
    if (isBelowTarget(product)) {
      userProductsBelowTarget(req.id);
    }

  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteProducts = async (req, res) => {
  try {
    let product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (product.user.toString() !== req.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Product.findByIdAndRemove(req.params.productId);
    res.json({ msg: 'Contact removed' });
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server Error');
  }
};

const getSite = link => {
  if (link.includes('amazon.in')) {
    return 'amazon';
  } else if (link.includes('flipkart')) {
    return 'flipkart';
  } else {
    throw Error('Enter Amazon or Flipkart product link');
  }
}

const getProductDetails = async (productLink) => {
  const site = getSite(productLink);
  const res = await axios.get(productLink);
  const $ = cheerio.load(res.data);
  let name, price;
  switch (site) {
    case 'amazon':
      name = $('#productTitle').text().trim();
      price = $('#priceblock_ourprice').text().trim();
      if (price === '') {
        price = $('#priceblock_dealprice').text().trim();
      }
      if (price === '') {
        price = $('#priceblock_saleprice').text().trim();
      }
      break;
    case 'flipkart':
      name = $('._35KyD6').text().trim();
      price = $('._1vC4OE._3qQ9m1').text().trim();
      break;
  }
  return { name, price };
};

exports.getRefreshedPrices = async (req, res) => {
  try {
    const user = await User.findById(req.id).select('-password');
    user.type === 'admin' ? await updatePrices() : await updatePrices(req.id);
    req.io.sockets.emit('updatedProducts', 'Products have been refreshed');
    res.status(200).send('Products have been refreshed');
    user.type === 'admin' ? userProductsBelowTarget(null, 'admin') : userProductsBelowTarget(req.id);
  } catch (e) {
    return res.status(500).send('Server error');
  }
}

const updatePrices = async (userId = null) => {
  const products = userId ? await Product.find({ user: userId }) : await Product.find();

  for (const product of products) {
    try {
      const { name, price } = await getProductDetails(product.link);
      if (price !== product.price) {
        product.price = price;
        product.name = name;
        await product.save();
      }
    } catch (e) {
      console.log(e.message);
      throw Error('Unable to update prices');
    }
  }
}

const isBelowTarget = (product) => {
  try {
    let { price, targetPrice } = product;
    if (price && targetPrice) {
      price = price.replace(/\.(.*)/, "").replace(/\D/g, "");
      targetPrice = targetPrice.replace(/\.(.*)/, "").replace(/\D/g, "");
      // console.log(price);
      // console.log(targetPrice);
      return parseInt(price) <= parseInt(targetPrice);
    }
  } catch (e) {
    console.log(e.message);
    throw Error('Unable to compare target price');
  }
}

const userProductsBelowTarget = async (userId, userType = null) => {
  try {
    const products = userType ? await Product.find() : await Product.find({ user: userId });
    const userProducts = {};
    for (const product of products) {
      if (isBelowTarget(product)) {
        userProducts[product.user] ? userProducts[product.user].push(product) : userProducts[product.user] = [product];
      }
    }
    // console.log('---------------------------');
    // console.log(userProducts);
    // console.log('---------------------------');
    for (const userIdKey in userProducts) {
      const user = await User.findById(userIdKey).select('-password');
      sendMail(user, userProducts[userIdKey]);
    }
  } catch (e) {
    console.log(e.message);
    throw Error('Unable to compare and mail products');
  }
}

const sendMail = async (user, products) => {
  // Change localhost to hosted place before deploying

  const { email, name } = user;

  // console.log('-----Original Products-----')
  // console.log(products);
  // console.log('-----Original Products-----')

  // products = [
  //   { name: 'qwe', price: 'Rs 100', productLink: 'http://www.google.com' },
  //   { name: 'asd', price: 'Rs 400', productLink: 'http://www.facebook.com' },
  // ]

  const message = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    templateId: 'd-fa386392e3ec4644b56889f2fc285d3a',
    dynamic_template_data: {
      subject: 'P₹ice Tracker - Buy these products now!',
      text: `Hi ${name}, buy these wishlisted products at your desired price now!`,
      products: products
    }
  };

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
  await sendgrid.send(message);
}