/**
 * Admin Dashboard
 * 
 * Main dashboard showing key statistics and quick actions
 */
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Button } from 'antd';
import { 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import type { DashboardStats } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={fetchStats}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>Admin Dashboard</h1>
      
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/admin/products')}>
            <Statistic
              title="Total Products"
              value={stats?.total_products || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {stats?.active_products || 0} active
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable onClick={() => navigate('/admin/orders')}>
            <Statistic
              title="Total Orders"
              value={stats?.total_orders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
              {stats?.pending_orders || 0} pending
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats?.total_revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.total_users || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button 
              type="primary" 
              icon={<ShoppingOutlined />}
              block
              size="large"
              onClick={() => navigate('/admin/products')}
            >
              Manage Products
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<ShoppingCartOutlined />}
              block
              size="large"
              onClick={() => navigate('/admin/orders')}
            >
              Manage Orders
            </Button>
          </Col>
          <Col xs={24} sm={8}>
            <Button 
              icon={<CheckCircleOutlined />}
              block
              size="large"
              onClick={() => navigate('/products')}
            >
              View Store
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Recent Activity Summary */}
      {stats && stats.pending_orders > 0 && (
        <Alert
          message="Pending Orders"
          description={`You have ${stats.pending_orders} pending order${stats.pending_orders > 1 ? 's' : ''} that need attention.`}
          type="warning"
          showIcon
          icon={<ClockCircleOutlined />}
          action={
            <Button size="small" type="primary" onClick={() => navigate('/admin/orders')}>
              View Orders
            </Button>
          }
        />
      )}
    </div>
  );
};

export default AdminDashboard;

