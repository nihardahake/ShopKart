import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCustomerProfile,
  loginCustomer,
  registerCustomer,
  logoutCustomer,
  changeCustomerPassword
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check initial authentication status via HttpOnly cookie
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const profile = await getCustomerProfile();
      setUser(profile);
      setAuthError(null);
    } catch (err) {
      setUser(null);
      // It's normal to fail if user is not logged in yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await loginCustomer(credentials);
      // Re-fetch profile to ensure session is active
      const profile = await getCustomerProfile();
      setUser(profile);
      return { success: true, user: profile };
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (data) => {
    try {
      setLoading(true);
      setAuthError(null);
      const res = await registerCustomer(data);
      return res;
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await logoutCustomer();
    } catch (err) {
      console.warn("Logout error:", err.message);
    } finally {
      setUser(null);
    }
  };

  // Change password handler
  const changePassword = async (passwords) => {
    return await changeCustomerPassword(passwords);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkAuth,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
