import api from './api';

export const getPayments = async (params = {}) => {
  const { data } = await api.get('/payments', { params });
  return data;
};

export const getPaymentById = async (id) => {
  const { data } = await api.get(`/payments/${id}`);
  return data;
};
