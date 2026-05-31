import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8088',
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('isAdmin');
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default client;
