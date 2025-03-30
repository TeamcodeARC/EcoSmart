import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyzeResourceUsage = async (data) => {
  try {
    const response = await api.post('/ai/analyze', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to analyze resource usage');
  }
};

export const predictFutureUsage = async (data) => {
  try {
    const response = await api.post('/ai/predict', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to predict future usage');
  }
};

export const getDamSystems = async () => {
  try {
    const response = await api.get('/dams');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dam systems');
  }
};

export const getDamById = async (id) => {
  try {
    const response = await api.get(`/dams/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dam details');
  }
};

export const addDamReading = async (id, data) => {
  try {
    const response = await api.post(`/dams/${id}/readings`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add dam reading');
  }
};

export default api;