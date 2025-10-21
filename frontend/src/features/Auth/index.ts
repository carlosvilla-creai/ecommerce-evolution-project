/**
 * Auth Feature - Barrel Exports
 * 
 * Central export point for Auth feature
 */

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Components
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';

// Pages
export { default as LoginPage } from './pages/LoginPage';
export { default as RegisterPage } from './pages/RegisterPage';
export { default as ProfilePage } from './pages/ProfilePage';

// Utils
export { default as ProtectedRoute } from './utils/ProtectedRoute';

// Types
export type { User, LoginRequest, RegisterRequest, AuthContextType } from './types';

// API
export { authApi } from './api/authApi';

