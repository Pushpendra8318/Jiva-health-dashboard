import api from './api';

export const getFamilyMembers = async (userId) => {
  const { data } = await api.get('/family', { params: { userId } });
  return data;
};

export const addFamilyMember = async (memberData) => {
  const { data } = await api.post('/family', memberData);
  return data;
};

export const updateFamilyMember = async (id, memberData) => {
  const { data } = await api.put(`/family/${id}`, memberData);
  return data;
};

export const deleteFamilyMember = async (id) => {
  const { data } = await api.delete(`/family/${id}`);
  return data;
};
