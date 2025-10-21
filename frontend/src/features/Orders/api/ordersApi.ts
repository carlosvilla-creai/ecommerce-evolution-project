/**
 * Orders API Client
 * 
 * Handles all API calls for the Orders feature
 */
import apiClient from '../../../shared/services/apiClient';
import type { Order, CreateOrderRequest, OrderListResponse } from '../types';

const ORDERS_BASE_URL = '/api/v1/orders';

export const ordersApi = {
  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return await apiClient.post<Order>(ORDERS_BASE_URL, orderData);
  },

  /**
   * Get all orders for the current user
   */
  async getMyOrders(skip: number = 0, limit: number = 20): Promise<OrderListResponse> {
    const params = new URLSearchParams();
    params.append('skip', skip.toString());
    params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `${ORDERS_BASE_URL}?${queryString}`;
    
    return await apiClient.get<OrderListResponse>(url);
  },

  /**
   * Get a single order by ID
   */
  async getOrder(orderId: number): Promise<Order> {
    return await apiClient.get<Order>(`${ORDERS_BASE_URL}/${orderId}`);
  },

  /**
   * Update order status (admin only)
   */
  async updateOrderStatus(orderId: number, newStatus: string): Promise<Order> {
    return await apiClient.put<Order>(`${ORDERS_BASE_URL}/${orderId}/status`, {
      new_status: newStatus
    });
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: number): Promise<Order> {
    return await this.updateOrderStatus(orderId, 'cancelled');
  }
};

