/**
 * Auth Context - Global Authentication State Management
 * 
 * ✅ CLEAN: Context API for global auth state
 * ✅ CLEAN: localStorage for token persistence
 * ✅ CLEAN: Type-safe auth operations
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import type { User, AuthContextType, RegisterRequest } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'ecommerce_token';
const USER_STORAGE_KEY = 'ecommerce_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Set token in API client
          authApi.setAuthToken(savedToken);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
        // Clear invalid data
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      // Save token and user
      setToken(response.access_token);
      setUser(response.user);
      
      // Persist to localStorage
      localStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(response.user));
      
      // Set token in API client
      authApi.setAuthToken(response.access_token);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data);
      
      // After successful registration, log the user in automatically
      setUser(response);
      
      // Note: Backend register doesn't return token, so we need to login
      await login(data.email, data.password);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.detail || 'Registration failed. Please try again.');
    }
  }, [login]);

  // Logout function
  const logout = useCallback(() => {
    // Clear state
    setUser(null);
    setToken(null);
    
    // Clear localStorage
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    // Remove token from API client
    authApi.removeAuthToken();
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      if (!token) {
        throw new Error('No authentication token');
      }

      const updatedUser = await authApi.updateProfile(data);
      
      // Update user state
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error(error.response?.data?.detail || 'Failed to update profile.');
    }
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

