import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchUserData } from '@/lib/APIServices/User/api'

import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return false;
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_API}/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      if (response.data && response.data.payload) {
        const { userId, roleId, username, email } = response.data.payload;
        const userData = { token, userId, roleId, username, email };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setLoading(false);
        return true;
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
      setLoading(false);
      return false;
    }
  };

  const isAuthenticated = async () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return await checkAuthToken();
  };

  const login = ({ token, userId, roleId, username, email }) => {
    const userData = { token, userId, roleId, username, email };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUserData }))
  }

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
      await checkAuthToken();
    };
    loadUserFromLocalStorage();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);