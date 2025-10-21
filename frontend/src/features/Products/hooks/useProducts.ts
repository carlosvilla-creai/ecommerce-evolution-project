/**
 * useProducts Hook
 * 
 * Custom hook for fetching and managing products list with filters
 */
import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../api/productsApi';
import type { Product, ProductFilters } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  setFilters: (filters: ProductFilters) => void;
  filters: ProductFilters;
}

export const useProducts = (initialFilters?: ProductFilters): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {
    skip: 0,
    limit: 20
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApi.getProducts(filters);
      
      setProducts(response.products);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    setFilters,
    filters
  };
};

