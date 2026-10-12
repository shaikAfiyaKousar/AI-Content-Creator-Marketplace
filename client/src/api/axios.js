import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');

const api = axios.create({
  // GitHub Pages is static hosting, so production must point to a separately
  // deployed API. Local development continues to use Vite's /api proxy.
  baseURL: configuredApiUrl
    ? `${configuredApiUrl.replace(/\/api$/, '')}/api`
    : '/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (!configuredApiUrl && !import.meta.env.DEV) {
      return Promise.reject(new Error('The marketplace API is not configured for this website yet.'));
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth failures
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = configuredApiUrl
        ? 'The marketplace API is temporarily unreachable. Please try again.'
        : 'The marketplace API is not configured for this website yet.';
    }
    if (error.response && error.response.status === 401) {
      // Keep the client session in sync when a token expires or is revoked.
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
