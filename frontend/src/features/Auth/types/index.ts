/**
 * Auth Types and Interfaces
 * 
 * Type definitions for authentication and user management
 */

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
}

export interface ProfileUpdateResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_active: boolean;
  role: string;
  created_at?: string;
  updated_at?: string;
}

