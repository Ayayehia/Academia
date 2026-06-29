import axios from 'axios';

import { useAuthStore } from '../store/authStore';

// Single configured Axios instance. Future data hooks import this.
// No real requests are made during technical setup.
export const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  // /photos is jsonplaceholder's slowest resource; give slow networks room to
  // respond before aborting.
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Placeholder: attach the auth token when one exists (no real auth yet).
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Placeholder: centralized place for future error normalization.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
