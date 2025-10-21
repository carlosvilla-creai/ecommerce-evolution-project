/**
 * OrderHistoryPage
 * 
 * Displays user's order history with pagination
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Spin, Empty, Alert, Pagination, Space, Button } from 'antd';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import type { Order } from '../types';

const { Title, Text } = Typography;

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { orders, loading, error, total, setPage, currentPage, pageSize } = useOrders(10);

  const handleViewDetails = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  const handlePageChange = (page: number) => {
    setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <Space style={{ marginBottom: 24, width: '100%', justifyContent: 'space-between' }}>
        <div>
          <Title level={2}>
            <ShoppingOutlined /> My Orders
          </Title>
          <Text type="secondary">
            View and manage your order history
          </Text>
        </div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </Space>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="Loading your orders..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <Alert
          message="Error loading orders"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Empty State */}
      {!loading && !error && orders.length === 0 && (
        <Empty
          description="You haven't placed any orders yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => navigate('/products')}>
            Start Shopping
          </Button>
        </Empty>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <>
          <div style={{ marginBottom: 24 }}>
            <Text type="secondary">
              Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} of {total} orders
            </Text>
          </div>

          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={handleViewDetails}
            />
          ))}

          {/* Pagination */}
          {total > pageSize && (
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} orders`}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderHistoryPage;

