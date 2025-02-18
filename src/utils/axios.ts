import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_LOCAL_API_URL || process.env.NEXT_PUBLIC_API_URL, // API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Menambahkan token Authorization ke setiap request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
