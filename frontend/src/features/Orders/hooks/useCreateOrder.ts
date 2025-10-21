/**
 * useCreateOrder Hook
 * 
 * Custom hook for creating orders
 */
import { useState } from 'react';
import { ordersApi } from '../api/ordersApi';
import type { CreateOrderRequest, Order } from '../types';

interface UseCreateOrderResult {
  createOrder: (orderData: CreateOrderRequest) => Promise<Order | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
  resetState: () => void;
}

export const useCreateOrder = (): UseCreateOrderResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createOrder = async (orderData: CreateOrderRequest): Promise<Order | null> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const order = await ordersApi.createOrder(orderData);
      
      setSuccess(true);
      return order;
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create order';
      setError(errorMessage);
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    createOrder,
    loading,
    error,
    success,
    resetState
  };
};

