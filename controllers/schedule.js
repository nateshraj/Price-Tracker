require('dotenv').config();
const axios = require('axios');

const loginAndRefreshPrices = async () => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    const formData = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
    const res = await axios.post('http://trackprice.herokuapp.com/api/login', formData, config);
    axios.defaults.headers.common['Authorization'] = res.data.token;
    await axios.get('http://trackprice.herokuapp.com/api/products/refresh', config);
  } catch (e) {
    console.log(`Unable to refresh prices - ${e.message}`);
  }
}

loginAndRefreshPrices();