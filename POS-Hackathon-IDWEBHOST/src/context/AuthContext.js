import React, { createContext, useContext, useState, useEffect } from 'react';
import { EMPLOYEES, STORE_INFO } from '../constants/employees';
import { authApi } from '../api/authApi';
import { setAuthToken, getAuthToken } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [shiftStartTime, setShiftStartTime] = useState(null);
  const [startingCash, setStartingCash] = useState(0);
  const [isShiftOpen, setIsShiftOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [authToken, setAuthTokenState] = useState(null);

  // Check backend health on startup
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      await authApi.checkHealth();
      setIsBackendOnline(true);
      return true;
    } catch (e) {
      console.log('Backend health status: offline/unreachable', e.message);
      setIsBackendOnline(false);
      return false;
    }
  };

  const login = async (identifier, secret) => {
    const rawId = (identifier || '').trim();
    const rawSecret = (secret || '').trim();

    if (!rawId) {
      return { success: false, error: 'Masukkan Email atau Employee ID' };
    }
    if (!rawSecret) {
      return { success: false, error: 'Masukkan Password atau 6-digit PIN' };
    }

    // Match against known employee directory
    const matchedEmployee = EMPLOYEES.find(
      (emp) =>
        emp.id.toUpperCase() === rawId.toUpperCase() ||
        emp.email.toLowerCase() === rawId.toLowerCase() ||
        emp.backendUsername.toLowerCase() === rawId.toLowerCase()
    );

    const usernameToTry = matchedEmployee ? matchedEmployee.backendUsername : rawId;
    const passwordToTry = matchedEmployee ? matchedEmployee.password : rawSecret;

    // Try backend authentication first
    try {
      const loginRes = await authApi.login(usernameToTry, passwordToTry);
      if (loginRes?.access_token) {
        setAuthToken(loginRes.access_token);
        setAuthTokenState(loginRes.access_token);
        setIsBackendOnline(true);

        // Fetch user profile from backend
        const profile = await authApi.getMe().catch(() => null);

        const mergedUser = {
          ...(matchedEmployee || EMPLOYEES[0]),
          backendId: profile?.id,
          username: profile?.username || usernameToTry,
          email: profile?.email || matchedEmployee?.email,
          role: profile?.role_code || matchedEmployee?.role || 'CASHIER',
          name: profile?.full_name || matchedEmployee?.name,
          permissions: profile?.permissions || [],
          isBackendAuthenticated: true,
        };

        setCurrentUser(mergedUser);
        return { success: true, user: mergedUser, fromBackend: true };
      }
    } catch (apiErr) {
      console.warn('Backend login error:', apiErr.message);

      // If credentials match local PIN or password, allow local fallback
      if (matchedEmployee) {
        if (
          rawSecret === matchedEmployee.pin ||
          rawSecret === matchedEmployee.password
        ) {
          setCurrentUser(matchedEmployee);
          return {
            success: true,
            user: matchedEmployee,
            fromBackend: false,
            warning: 'Masuk dalam mode offline (backend offline)',
          };
        }
      }

      return {
        success: false,
        error: apiErr.message || 'Gagal login ke backend. Periksa email & password.',
      };
    }

    // Local account fallback
    if (matchedEmployee && (rawSecret === matchedEmployee.pin || rawSecret === matchedEmployee.password)) {
      setCurrentUser(matchedEmployee);
      return { success: true, user: matchedEmployee, fromBackend: false };
    }

    return {
      success: false,
      error: 'Akun tidak ditemukan atau password/PIN salah',
    };
  };

  const openShift = (cash) => {
    const amount = parseInt(cash, 10) || 0;
    setStartingCash(amount);
    setIsShiftOpen(true);
    setShiftStartTime(new Date());
  };

  const closeShift = () => {
    setIsShiftOpen(false);
    setStartingCash(0);
    setCurrentUser(null);
    setShiftStartTime(null);
    setAuthToken(null);
    setAuthTokenState(null);
  };

  const logout = () => {
    closeShift();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isBackendOnline,
        authToken,
        shiftStartTime,
        startingCash,
        isShiftOpen,
        storeInfo: STORE_INFO,
        employeesList: EMPLOYEES,
        checkBackendHealth,
        login,
        openShift,
        closeShift,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      currentUser: null,
      isAuthenticated: false,
      isBackendOnline: false,
      authToken: null,
      shiftStartTime: null,
      startingCash: 0,
      isShiftOpen: false,
      storeInfo: STORE_INFO,
      employeesList: EMPLOYEES,
      checkBackendHealth: () => Promise.resolve(false),
      login: () => Promise.resolve({ success: false, error: 'Provider not ready' }),
      openShift: () => {},
      closeShift: () => {},
      logout: () => {},
    };
  }
  return context;
};

export default AuthContext;
