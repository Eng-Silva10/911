// src/auth.js
import api from './api';

export const login = async (credentials) => {
  try {
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login failed', error);
    return false;
  }
};

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed', error);
  } finally {
    localStorage.removeItem('token');
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};