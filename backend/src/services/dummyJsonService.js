const axios = require('axios');

const fetchAllProducts = async () => {
  let products = [];
  let skip = 0;
  const limit = 10;
  let total = 0;

  try {
    do {
      const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      products = products.concat(response.data.products);
      total = response.data.total;
      skip += limit;
    } while (products.length < total);
    return products;
  } catch (error) {
    console.error('Error fetching from dummyjson:', error);
    throw new Error('Could not fetch from dummyjson.');
  }
};

module.exports = {
  fetchAllProducts,
};