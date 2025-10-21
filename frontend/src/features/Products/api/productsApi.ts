/**
 * Products API Client
 * 
 * Handles all API calls for the Products feature
 */
import apiClient from '../../../shared/services/apiClient';
import type { Product, ProductListResponse, ProductFilters } from '../types';

const PRODUCTS_BASE_URL = '/api/v1/products';

export const productsApi = {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: ProductFilters): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `${PRODUCTS_BASE_URL}/?${queryString}` : `${PRODUCTS_BASE_URL}/`;
    
    return await apiClient.get<ProductListResponse>(url);
  },

  /**
   * Get product by ID
   */
  async getProduct(id: number): Promise<Product> {
    return await apiClient.get<Product>(`${PRODUCTS_BASE_URL}/${id}`);
  },

  /**
   * Create a new product (admin only)
   */
  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    return await apiClient.post<Product>(`${PRODUCTS_BASE_URL}/`, product);
  },

  /**
   * Update a product (admin only)
   */
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return await apiClient.put<Product>(`${PRODUCTS_BASE_URL}/${id}`, product);
  },

  /**
   * Delete a product (admin only)
   */
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`${PRODUCTS_BASE_URL}/${id}`);
  }
};

