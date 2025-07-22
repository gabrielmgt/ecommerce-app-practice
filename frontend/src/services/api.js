import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDummyCart = async () => {
  try {
    // Get a random cart from dummyjson
    const randomCartId = Math.floor(Math.random() * 30) + 1;
    const response = await axios.get(`https://dummyjson.com/carts/${randomCartId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dummy cart:', error);
    throw error;
  }
};

export const postCart = (cartData) => {
  return apiClient.post('/cart', cartData);
};
