/**
 * Admin Orders Management
 * 
 * View and manage all orders with status updates
 */
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Tag, 
  Space,
  Button,
  Select,
  message,
  Card,
  Modal,
  Descriptions
} from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import type { Order } from '@features/Orders/types';

const { Option } = Select;

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  // Status update modal
  const [isStatusModalVisible, setIsStatusModalVisible] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      const response = await adminApi.getAllOrders(skip, pageSize);
      setOrders(response.orders);
      setTotal(response.total);
    } catch (error: any) {
      message.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusModalVisible(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    
    try {
      await adminApi.updateOrderStatus(selectedOrder.id, { status: newStatus as any });
      message.success('Order status updated successfully');
      setIsStatusModalVisible(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      message.error('Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'pending': 'orange',
      'confirmed': 'blue',
      'processing': 'cyan',
      'shipped': 'purple',
      'delivered': 'green',
      'cancelled': 'red',
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 80,
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'Total',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 100,
      render: (total: number) => formatPrice(total),
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleStatusChange(record)}
          >
            Status
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title={<h2 style={{ margin: 0 }}>Order Management</h2>}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={isStatusModalVisible}
        onOk={handleStatusUpdate}
        onCancel={() => {
          setIsStatusModalVisible(false);
          setSelectedOrder(null);
        }}
        okText="Update"
      >
        {selectedOrder && (
          <>
            <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Order ID">#{selectedOrder.id}</Descriptions.Item>
              <Descriptions.Item label="Current Status">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                {formatPrice(selectedOrder.total_amount)}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                New Status:
              </label>
              <Select
                style={{ width: '100%' }}
                value={newStatus}
                onChange={(value) => setNewStatus(value)}
              >
                <Option value="pending">Pending</Option>
                <Option value="confirmed">Confirmed</Option>
                <Option value="processing">Processing</Option>
                <Option value="shipped">Shipped</Option>
                <Option value="delivered">Delivered</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;

