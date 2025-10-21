/**
 * Auth API Client
 * 
 * Centralized API functions for authentication
 */
import apiClient from '@shared/services/apiClient';
import type { LoginRequest, RegisterRequest, LoginResponse, User, ProfileUpdateRequest } from '../types';

class AuthApi {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/v1/users/login', credentials);
    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/api/v1/users/register', data);
    return response;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/api/v1/users/me');
    return response;
  }

  /**
   * Update current user profile
   */
  async updateProfile(data: ProfileUpdateRequest): Promise<User> {
    const response = await apiClient.put<User>('/api/v1/users/me', data);
    return response;
  }

  /**
   * Set authentication token in API client
   */
  setAuthToken(token: string): void {
    apiClient.setAuthToken(token);
  }

  /**
   * Remove authentication token from API client
   */
  removeAuthToken(): void {
    apiClient.removeAuthToken();
  }
}

export const authApi = new AuthApi();

