/**
 * Admin Feature Types
 * 
 * Type definitions for admin-specific functionality
 */

export interface DashboardStats {
  total_products: number;
  active_products: number;
  total_orders: number;
  pending_orders: number;
  total_revenue: number;
  total_users: number;
}

export interface AdminProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminOrder {
  id: number;
  user_id: number;
  user_email?: string;
  status: string;
  total_amount: number;
  items_count: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
}

export interface UpdateOrderStatusRequest {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

