import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: any) => api.post('/token', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }),
  register: (data: any) => api.post('/register', data),
  updatePassword: (data: any) => api.put('/user/password', data),
};

export const scanApi = {
  scanUrl: (url: string, deep_scan: boolean = true) => api.post('/scan/url', { url, deep_scan }),
  scanEmail: (email_text: string, deep_scan: boolean = true) => api.post('/scan/email', { email_text, deep_scan }),
  getHistory: () => api.get('/scans'),
  getStats: () => api.get('/stats'),
  deleteScan: (id: number) => api.delete(`/scans/${id}`),
  clearHistory: () => api.delete('/scans'),
};

export default api;
