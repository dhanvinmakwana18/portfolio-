import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatWithNexus = async (query: string, mode: string = 'auto') => {
  const response = await api.post('/chat', { query, mode });
  return response.data;
};

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/kb/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await api.get('/kb/documents');
  return response.data;
};

export const getStatus = async () => {
  const response = await api.get('/status');
  return response.data;
};
