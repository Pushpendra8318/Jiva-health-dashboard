import api from './api';

export const getOrders = async (params = {}) => {
  const { data } = await api.get('/orders', { params });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

export const updateOrder = async (id, orderData) => {
  const { data } = await api.put(`/orders/${id}`, orderData);
  return data;
};

export const createOrder = async (orderData) => {
  const { data } = await api.post('/orders', orderData);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await api.delete(`/orders/${id}`);
  return data;
};
