import axios from 'axios';
import { safeStorage } from './safe-storage';

export const AUTH_STORAGE_KEYS = {
  token: 'bouri_token',
  user: 'bouri_user',
} as const;

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api';

const AUTH_PAGES = new Set(['/login', '/register', '/admin/login']);

const normalizePath = (pathname: string) => {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
};

const shouldRedirectAfterUnauthorized = () => {
  if (typeof window === 'undefined') return false;
  const currentPath = normalizePath(window.location.pathname);
  return !AUTH_PAGES.has(currentPath);
};

const clearAuthSession = () => {
  safeStorage.removeItem(AUTH_STORAGE_KEYS.token);
  safeStorage.removeItem(AUTH_STORAGE_KEYS.user);
};

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = safeStorage.getItem(AUTH_STORAGE_KEYS.token);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      clearAuthSession();

      if (shouldRedirectAfterUnauthorized() && typeof window !== 'undefined') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  },
);

