import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getRecommendations = (query, preferences = {}) => {
  return api.post('/recommendations', { query, preferences });
};

export const getTrendingProducts = (limit = 5) => {
  return api.get(`/trending?limit=${limit}`);
};

export const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

export const getAllProducts = () => {
  return api.get('/products');
};

export const getSimilarProducts = (id, limit = 3) => {
  return api.get(`/products/${id}/similar?limit=${limit}`);
};

export const queryRAG = (query) => {
  return api.post('/rag/query', { query });
};

export const searchProducts = (params) => {
  const queryString = new URLSearchParams(params).toString();
  return api.get(`/search?${queryString}`);
};

export const getIngredients = () => {
  return api.get('/ingredients');
};

export default api;
