import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getCustomers = async (params = {}) => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const getCustomerById = async (customerId) => {
  const response = await api.get(`/customers/${customerId}`);
  return response.data;
};

export const predictCustomer = async (customerData) => {
  const response = await api.post('/predict', customerData);
  return response.data;
};

export const optimizeBudget = async (budgetData) => {
  const response = await api.post('/budget', budgetData);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export const getModelMetrics = async () => {
  const response = await api.get('/model-metrics');
  return response.data;
};

export default api;
