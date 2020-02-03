require('dotenv').config();
const axios = require('axios');

const loginAndRefreshPrices = async () => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    const formData = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
    const res = await axios.post('http://localhost:5000/api/login', formData, config);
    axios.defaults.headers.common['Authorization'] = res.data.token;
    await axios.get('http://localhost:5000/api/products/refresh', config);
  } catch (e) {
    console.log(e);
  }
}

loginAndRefreshPrices();