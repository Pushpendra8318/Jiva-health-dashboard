import api from './api';

export const getUsers = async (params = {}) => {
  const { data } = await api.get('/users', { params });
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const createUser = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const togglePrime = async (id) => {
  const { data } = await api.patch(`/users/${id}/prime`);
  return data;
};

export const toggleStatus = async (id, status) => {
  const { data } = await api.patch(`/users/${id}/status`, { status });
  return data;
};

export const addAddress = async (id, addressData) => {
  const { data } = await api.post(`/users/${id}/addresses`, addressData);
  return data;
};

export const deleteAddress = async (id, addressId) => {
  const { data } = await api.delete(`/users/${id}/addresses/${addressId}`);
  return data;
};
