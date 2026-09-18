// AURA SMART POS - Authentication API Services
import { apiClient, setAuthToken } from './client.js';

export const authApi = {
  // Check backend health
  checkHealth: async () => {
    return apiClient('/health');
  },

  // Login with username/email & password
  login: async (usernameOrEmail, password) => {
    const rawUser = (usernameOrEmail || '').trim();
    const rawPass = (password || '').trim();

    // Map common variants, specifically 'chasier' (Indonesian spelling in docs) -> 'cashier'
    let normalizedUser = rawUser;
    let normalizedPass = rawPass;

    const lowerUser = rawUser.toLowerCase();
    if (lowerUser === 'chasier@aura.pos' || lowerUser === 'chasier') {
      normalizedUser = 'cashier@aura.pos';
    } else if (lowerUser === 'cashier') {
      normalizedUser = 'cashier@aura.pos';
    } else if (lowerUser === 'owner') {
      normalizedUser = 'owner@aura.pos';
    } else if (lowerUser === 'staff' || lowerUser === 'staff gudang') {
      normalizedUser = 'staff@aura.pos';
    } else if (lowerUser === 'admin' || lowerUser === 'admin gudang') {
      normalizedUser = 'admin@aura.pos';
    }

    if (rawPass === 'chasier123') {
      normalizedPass = 'cashier123';
    }

    // Try candidates: normalized first, then raw if different
    const candidates = [
      { u: normalizedUser, p: normalizedPass },
    ];
    if (normalizedUser !== rawUser || normalizedPass !== rawPass) {
      candidates.push({ u: rawUser, p: rawPass });
    }

    let res = null;
    let lastError = null;

    for (const cred of candidates) {
      try {
        res = await apiClient('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            username_or_email: cred.u,
            password: cred.p,
          }),
        });
        if (res?.access_token) {
          setAuthToken(res.access_token);
          return res;
        }
      } catch (err) {
        lastError = err;
      }
    }

    throw lastError || new Error('Gagal login ke backend. Periksa email & password.');
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
