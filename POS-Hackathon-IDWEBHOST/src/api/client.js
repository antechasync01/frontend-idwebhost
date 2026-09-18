// AURA SMART POS - Core API Client Wrapper
import { API_CONFIG } from './config.js';

let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem('aura_pos_token', token);
      } else {
        window.localStorage.removeItem('aura_pos_token');
      }
    }
  } catch (e) {
    // localStorage not accessible
  }
};

export const getAuthToken = () => {
  if (currentAuthToken) return currentAuthToken;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      currentAuthToken = window.localStorage.getItem('aura_pos_token');
    }
  } catch (e) {}
  return currentAuthToken;
};

export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller
    ? setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS)
    : null;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller ? controller.signal : undefined,
    });

    if (timeoutId) clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        data?.error?.message ||
        data?.detail ||
        `Request gagal dengan status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    // Backend returns { data: ..., meta: ... }
    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Timeout menghubungi server backend (${API_CONFIG.BASE_URL})`);
    }
    throw err;
  }
};

export default apiClient;
