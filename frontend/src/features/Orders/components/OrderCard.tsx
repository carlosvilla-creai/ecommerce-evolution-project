/**
 * OrderCard Component
 * 
 * Displays an order summary in a card format
 */
import React from 'react';
import { Card, Tag, Descriptions, Button, Space } from 'antd';
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '../types';

interface OrderCardProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
}

const getStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    pending: 'orange',
    confirmed: 'blue',
    processing: 'cyan',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red'
  };
  return statusColors[status] || 'default';
};

const getStatusText = (status: OrderStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <Card
      hoverable
      title={
        <Space>
          <ShoppingOutlined />
          <span>Order #{order.id}</span>
          <Tag color={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Tag>
        </Space>
      }
      extra={
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => onViewDetails?.(order)}
        >
          View Details
        </Button>
      }
      style={{ marginBottom: 16 }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Order Date">
          {formatDate(order.created_at)}
        </Descriptions.Item>
        <Descriptions.Item label="Items">
          {order.items.length} item(s)
        </Descriptions.Item>
        <Descriptions.Item label="Subtotal">
          {formatPrice(order.subtotal)}
        </Descriptions.Item>
        <Descriptions.Item label="Tax">
          {formatPrice(order.tax)}
        </Descriptions.Item>
        <Descriptions.Item label="Shipping">
          {formatPrice(order.shipping_cost)}
        </Descriptions.Item>
        <Descriptions.Item label="Total">
          <strong style={{ fontSize: '16px', color: '#1890ff' }}>
            {formatPrice(order.total)}
          </strong>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderCard;

