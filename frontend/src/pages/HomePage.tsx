/**
 * Home Page - Project Complete! 🎉
 * 
 * Celebrates the completion of all 5 stages of the E-commerce Evolution Project
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space, Tag, Divider } from 'antd';
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
  DashboardOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useAuth } from '../features/Auth';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const stages = [
    {
      stage: 1,
      title: 'Clean Architecture Backend',
      description: 'Products module with Domain, Application, and Infrastructure layers',
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      status: 'Complete'
    },
    {
      stage: 2,
      title: 'Users & Frontend Base',
      description: 'JWT authentication and feature-based React architecture',
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      status: 'Complete'
    },
    {
      stage: 3,
      title: 'Orders & Shopping Cart',
      description: 'Complete order management with cart persistence',
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      status: 'Complete'
    },
    {
      stage: 4,
      title: 'Auth Frontend & Protected Routes',
      description: 'Login, registration, and role-based access control',
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      status: 'Complete'
    },
    {
      stage: 5,
      title: 'Admin Panel & Final Polish',
      description: 'Full admin dashboard with CRUD operations',
      icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
      status: 'Complete'
    }
  ];

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore our product catalog',
      icon: <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      path: '/products',
      color: '#e6f7ff'
    },
    {
      title: 'Shopping Cart',
      description: 'View your cart items',
      icon: <ShoppingCartOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      path: '/cart',
      color: '#f6ffed'
    },
    {
      title: 'My Orders',
      description: 'Track your order history',
      icon: <UnorderedListOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
      path: '/orders',
      color: '#f9f0ff',
      requiresAuth: true
    },
    {
      title: 'My Profile',
      description: 'Manage your account',
      icon: <UserOutlined style={{ fontSize: 32, color: '#fa8c16' }} />,
      path: '/profile',
      color: '#fff7e6',
      requiresAuth: true
    }
  ];

  // Add admin action if user is admin
  if (isAuthenticated && user?.role === 'admin') {
    quickActions.push({
      title: 'Admin Dashboard',
      description: 'Manage products and orders',
      icon: <DashboardOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
      path: '/admin',
      color: '#fff0f6',
      requiresAuth: true
    });
  }

  const handleNavigate = (path: string, requiresAuth?: boolean) => {
    if (requiresAuth && !isAuthenticated) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 64,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 40px',
        borderRadius: 16,
        color: 'white'
      }}>
        <RocketOutlined style={{ fontSize: 64, marginBottom: 16 }} />
        <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
          🎉 E-Commerce Evolution Project 🎉
        </Title>
        <Title level={3} style={{ color: 'white', fontWeight: 'normal', marginBottom: 24 }}>
          From Legacy Code to Enterprise-Grade Architecture
        </Title>
        <Space size="large">
          <Tag color="green" style={{ fontSize: 16, padding: '8px 16px' }}>
            <CheckCircleOutlined /> 5 Stages Complete
          </Tag>
          <Tag color="blue" style={{ fontSize: 16, padding: '8px 16px' }}>
            <ThunderboltOutlined /> 100% Operational
          </Tag>
        </Space>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 64 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          🚀 Quick Actions
        </Title>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} md={8} lg={action.title === 'Admin Dashboard' ? 24 : 8} key={index}>
              <Card
                hoverable
                onClick={() => handleNavigate(action.path, action.requiresAuth)}
                style={{ 
                  height: '100%', 
                  background: action.color,
                  border: '2px solid #f0f0f0'
                }}
              >
                <Space direction="vertical" align="center" style={{ width: '100%', textAlign: 'center' }}>
                  {action.icon}
                  <Title level={4} style={{ margin: 0 }}>{action.title}</Title>
                  <Text type="secondary">{action.description}</Text>
                  {action.requiresAuth && !isAuthenticated && (
                    <Tag color="orange">Login Required</Tag>
                  )}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      {/* Project Timeline */}
      <div style={{ marginBottom: 64 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          📅 Project Evolution Timeline
        </Title>
        <Row gutter={[16, 16]}>
          {stages.map((stage) => (
            <Col xs={24} sm={12} md={8} key={stage.stage}>
              <Card
                style={{ height: '100%' }}
                title={
                  <Space>
                    {stage.icon}
                    <span>Stage {stage.stage}</span>
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={5} style={{ margin: 0 }}>{stage.title}</Title>
                  <Paragraph type="secondary" style={{ margin: 0 }}>
                    {stage.description}
                  </Paragraph>
                  <Tag color="success">{stage.status}</Tag>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <Divider />

      {/* Tech Stack */}
      <div style={{ marginBottom: 64 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
          💻 Technology Stack
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="🔧 Backend" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>✅ <strong>FastAPI</strong> - Modern async Python framework</Text>
                <Text>✅ <strong>SQLAlchemy</strong> - ORM with async support</Text>
                <Text>✅ <strong>Pydantic V2</strong> - Data validation</Text>
                <Text>✅ <strong>JWT</strong> - Secure authentication</Text>
                <Text>✅ <strong>Clean Architecture</strong> - 3-layer design</Text>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="⚛️ Frontend" bordered={false}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>✅ <strong>React 18</strong> - Modern UI library</Text>
                <Text>✅ <strong>TypeScript</strong> - Type-safe development</Text>
                <Text>✅ <strong>Ant Design</strong> - Professional UI components</Text>
                <Text>✅ <strong>Vite</strong> - Lightning-fast build tool</Text>
                <Text>✅ <strong>Context API</strong> - State management</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      {/* CTA Section */}
      <div style={{ 
        textAlign: 'center',
        background: '#f0f2f5',
        padding: '48px 40px',
        borderRadius: 16
      }}>
        <Title level={3}>Ready to explore?</Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 24 }}>
          Start browsing products or manage the platform as an admin
        </Paragraph>
        <Space size="large">
          <Button 
            type="primary" 
            size="large" 
            icon={<ShoppingOutlined />}
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
          {!isAuthenticated && (
            <Button 
              size="large" 
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Button 
              type="default" 
              size="large" 
              icon={<DashboardOutlined />}
              onClick={() => navigate('/admin')}
            >
              Admin Dashboard
            </Button>
          )}
        </Space>
      </div>

      {/* Footer Stats */}
      <div style={{ 
        marginTop: 48,
        textAlign: 'center',
        padding: '32px 0',
        borderTop: '1px solid #f0f0f0'
      }}>
        <Space size="large" wrap>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>~10,000+</Title>
            <Text type="secondary">Lines of Code</Text>
          </div>
          <Divider type="vertical" style={{ height: 40 }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>8</Title>
            <Text type="secondary">Major Features</Text>
          </div>
          <Divider type="vertical" style={{ height: 40 }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#722ed1' }}>5</Title>
            <Text type="secondary">Stages Completed</Text>
          </div>
          <Divider type="vertical" style={{ height: 40 }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#fa8c16' }}>100%</Title>
            <Text type="secondary">Project Complete</Text>
          </div>
        </Space>
      </div>

      {/* Welcome Message for Logged-in Users */}
      {isAuthenticated && (
        <div style={{ 
          marginTop: 32,
          textAlign: 'center',
          padding: 24,
          background: '#e6f7ff',
          borderRadius: 8,
          border: '1px solid #91d5ff'
        }}>
          <Text style={{ fontSize: 16 }}>
            👋 Welcome back, <strong>{user?.first_name}</strong>! 
            {user?.role === 'admin' && ' You have admin access.'}
          </Text>
        </div>
      )}
    </div>
  );
};

export default HomePage;
