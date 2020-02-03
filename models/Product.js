const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  name: {
    type: String
  },
  link: {
    type: String,
    required: true
  },
  price: {
    // Change to number later
    type: String
  },
  targetPrice: {
    // Change to number later
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('product', ProductSchema);