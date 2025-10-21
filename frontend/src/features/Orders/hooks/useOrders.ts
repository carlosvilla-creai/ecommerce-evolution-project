/**
 * useOrders Hook
 * 
 * Custom hook for fetching and managing orders list
 */
import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '../api/ordersApi';
import type { Order } from '../types';

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  total: number;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  currentPage: number;
  pageSize: number;
}

export const useOrders = (initialPageSize: number = 10): UseOrdersResult => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = initialPageSize;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * pageSize;
      const response = await ordersApi.getMyOrders(skip, pageSize);
      setOrders(response.orders);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    total,
    refetch: fetchOrders,
    setPage: setCurrentPage,
    currentPage,
    pageSize
  };
};

