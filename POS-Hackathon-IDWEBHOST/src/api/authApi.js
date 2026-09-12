// AURA SMART POS - Authentication API Services
import { apiClient, setAuthToken } from './client';

export const authApi = {
  // Check backend health
  checkHealth: async () => {
    return apiClient('/health');
  },

  // Login with username/email & password
  login: async (usernameOrEmail, password) => {
    let normalizedUser = (usernameOrEmail || '').trim();
    let normalizedPass = (password || '').trim();

    // Support both 'chasier' (Indonesian phonetic) and 'cashier' (English)
    const lowerUser = normalizedUser.toLowerCase();
    if (lowerUser === 'chasier@aura.pos' || lowerUser === 'chasier') {
      normalizedUser = 'cashier@aura.pos';
    } else if (lowerUser === 'owner') {
      normalizedUser = 'owner@aura.pos';
    } else if (lowerUser === 'staff' || lowerUser === 'staff gudang') {
      normalizedUser = 'staff@aura.pos';
    } else if (lowerUser === 'admin' || lowerUser === 'admin gudang') {
      normalizedUser = 'admin@aura.pos';
    } else if (lowerUser === 'cashier') {
      normalizedUser = 'cashier@aura.pos';
    }

    if (normalizedPass === 'chasier123') {
      normalizedPass = 'cashier123';
    }

    const payload = {
      username_or_email: normalizedUser,
      password: normalizedPass,
    };

    const res = await apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res?.access_token) {
      setAuthToken(res.access_token);
    }

    return res;
  },

  // Get current authenticated user details
  getMe: async () => {
    return apiClient('/auth/me');
  },

  // Refresh JWT token
  refresh: async (refreshToken) => {
    return apiClient('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },
};

export default authApi;
