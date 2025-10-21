/**
 * Admin API Client
 * 
 * Handles all API calls for admin operations (requires admin role)
 */
import apiClient from '@shared/services/apiClient';
import type { 
  DashboardStats, 
  AdminProduct, 
  AdminOrder,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateOrderStatusRequest 
} from '../types';
import type { ProductListResponse } from '@features/Products/types';
import type { OrderListResponse } from '@features/Orders/types';

const PRODUCTS_BASE_URL = '/api/v1/products';
const ORDERS_BASE_URL = '/api/v1/orders';

export const adminApi = {
  /**
   * Get dashboard statistics
   * Note: This endpoint doesn't exist yet in backend, will return mock data
   */
  async getDashboardStats(): Promise<DashboardStats> {
    // TODO: Implement backend endpoint for dashboard stats
    // For now, we'll calculate from existing data
    try {
      // ✅ FIXED: Backend has max limit of 100, so we use that
      // Note: This means dashboard stats will only count first 100 products/orders
      const products = await apiClient.get<ProductListResponse>(`${PRODUCTS_BASE_URL}?limit=100`);
      const orders = await apiClient.get<OrderListResponse>(`${ORDERS_BASE_URL}?limit=100`);
      
      const activeProducts = products.products.filter(p => p.is_active).length;
      const pendingOrders = orders.orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders.orders.reduce((sum, order) => sum + parseFloat(order.total.toString()), 0);
      
      return {
        total_products: products.total,
        active_products: activeProducts,
        total_orders: orders.total,
        pending_orders: pendingOrders,
        total_revenue: totalRevenue,
        total_users: 0 // Not available yet
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Get all products (admin view - includes inactive)
   * Note: For now, this only returns active products since the backend defaults to active_only=true
   * In the future, we should add a backend endpoint specifically for admin that returns all products
   */
  async getAllProducts(skip: number = 0, limit: number = 50): Promise<ProductListResponse> {
    // ✅ FIXED: Removed active_only parameter - FastAPI was having trouble parsing 'false' as boolean
    // TODO: Add admin-specific endpoint that returns all products including inactive
    return await apiClient.get<ProductListResponse>(
      `${PRODUCTS_BASE_URL}?skip=${skip}&limit=${limit}`
    );
  },

  /**
   * Create a new product
   */
  async createProduct(product: CreateProductRequest): Promise<AdminProduct> {
    return await apiClient.post<AdminProduct>(PRODUCTS_BASE_URL, product);
  },

  /**
   * Update an existing product
   */
  async updateProduct(productId: number, updates: UpdateProductRequest): Promise<AdminProduct> {
    return await apiClient.put<AdminProduct>(`${PRODUCTS_BASE_URL}/${productId}`, updates);
  },

  /**
   * Delete a product (soft delete by default)
   */
  async deleteProduct(productId: number, hardDelete: boolean = false): Promise<void> {
    // ✅ Only send hard_delete parameter if it's true (to avoid boolean parsing issues)
    const query = hardDelete ? '?hard_delete=true' : '';
    await apiClient.delete(`${PRODUCTS_BASE_URL}/${productId}${query}`);
  },

  /**
   * Get all orders (admin view)
   */
  async getAllOrders(skip: number = 0, limit: number = 50): Promise<OrderListResponse> {
    return await apiClient.get<OrderListResponse>(
      `${ORDERS_BASE_URL}?skip=${skip}&limit=${limit}`
    );
  },

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: number, status: UpdateOrderStatusRequest): Promise<AdminOrder> {
    return await apiClient.patch<AdminOrder>(`${ORDERS_BASE_URL}/${orderId}/status`, status);
  }
};

