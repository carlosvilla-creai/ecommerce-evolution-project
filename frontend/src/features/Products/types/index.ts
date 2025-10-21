/**
 * Products Feature Types
 * 
 * TypeScript interfaces and types for the Products feature
 */

export interface Product {
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

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  skip?: number;
  limit?: number;
}

