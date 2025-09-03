import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/', 
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401 && error.config && !error.config._retry) {
      error.config._retry = true;
      try {
        const { data } = await api.post('/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        return api(error.config);
      } catch {
        localStorage.removeItem('accessToken');
      }
    }
    return Promise.reject(error);
  }
);

export default api;