/**
 * useProduct Hook
 * 
 * Custom hook for fetching a single product by ID
 */
import { useState, useEffect } from 'react';
import { productsApi } from '../api/productsApi';
import type { Product } from '../types';

interface UseProductResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProduct = (id: number): UseProductResult => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await productsApi.getProduct(id);
      
      setProduct(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
};

