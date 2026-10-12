import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState({ creators: [], brands: [] });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setProfile(res.data.profile);
          }
        } catch (err) {
          console.warn('[Auth] Token invalid or expired, resetting session.');
          localStorage.removeItem('token');
          setUser(null);
          setProfile(null);
        }
      }
      
      // Load demo accounts list for rapid testing
      try {
        const demoRes = await api.get('/auth/demo-accounts');
        if (demoRes.data.success) {
          setDemoAccounts(demoRes.data.demoAccounts);
        }
      } catch (e) {
        // demo accounts silent fail
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setProfile(res.data.profile);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (updatedUser, updatedProfile) => {
    if (updatedUser) setUser(updatedUser);
    if (updatedProfile) setProfile(updatedProfile);
  };

  const quickSwitch = async (email, password = 'password123') => {
    setLoading(true);
    try {
      const res = await login(email, password);
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        updateProfileState,
        quickSwitch,
        demoAccounts,
        isAuthenticated: !!user,
        isBrand: user?.role === 'brand',
        isCreator: user?.role === 'creator'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
