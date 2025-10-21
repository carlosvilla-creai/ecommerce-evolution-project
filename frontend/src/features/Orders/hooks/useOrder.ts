/**
 * useOrder Hook
 * 
 * Custom hook for fetching a single order by ID
 */
import { useState, useEffect } from 'react';
import { ordersApi } from '../api/ordersApi';
import type { Order } from '../types';

interface UseOrderResult {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useOrder = (orderId: number): UseOrderResult => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersApi.getOrder(orderId);
      setOrder(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder
  };
};

