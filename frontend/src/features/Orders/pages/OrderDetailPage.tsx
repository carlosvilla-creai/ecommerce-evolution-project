/**
 * OrderDetailPage
 * 
 * Displays detailed information about a single order
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Spin, 
  Alert, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Divider,
  Result
} from 'antd';
import { ArrowLeftOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useOrder } from '../hooks/useOrder';
import OrderItemList from '../components/OrderItemList';
import type { OrderStatus } from '../types';

const { Title, Text } = Typography;

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

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, loading, error } = useOrder(Number(orderId));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Loading State
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Loading order details..." />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 16px' }}>
        <Result
          status="error"
          title="Failed to load order"
          subTitle={error}
          extra={
            <Button type="primary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          }
        />
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 16px' }}>
        <Result
          status="404"
          title="Order Not Found"
          subTitle="The order you're looking for doesn't exist."
          extra={
            <Button type="primary" onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <Space style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/orders')}
        >
          Back to Orders
        </Button>
      </Space>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>
          <ShoppingOutlined /> Order #{order.id}
        </Title>
        <Tag color={getStatusColor(order.status)} style={{ fontSize: '16px', padding: '8px 16px' }}>
          {getStatusText(order.status)}
        </Tag>
      </div>

      {/* Order Information */}
      <Card title="Order Information" style={{ marginBottom: 24 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 2 }} bordered>
          <Descriptions.Item label="Order ID">#{order.id}</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={getStatusColor(order.status)}>
              {getStatusText(order.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Order Date">
            {formatDate(order.created_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDate(order.updated_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Shipping Address" span={2}>
            {order.shipping_address}
          </Descriptions.Item>
          <Descriptions.Item label="Billing Address" span={2}>
            {order.billing_address}
          </Descriptions.Item>
          {order.notes && (
            <Descriptions.Item label="Order Notes" span={2}>
              {order.notes}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Order Items */}
      <Card title="Order Items" style={{ marginBottom: 24 }}>
        <OrderItemList items={order.items} />
      </Card>

      {/* Order Summary */}
      <Card title="Order Summary">
        <div style={{ maxWidth: 400, marginLeft: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text>Subtotal:</Text>
            <Text>{formatPrice(order.subtotal)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text>Tax:</Text>
            <Text>{formatPrice(order.tax)}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text>Shipping:</Text>
            <Text>{formatPrice(order.shipping_cost)}</Text>
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4} style={{ margin: 0 }}>Total:</Title>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {formatPrice(order.total)}
            </Title>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetailPage;

