/**
 * LoginPage
 * 
 * Login page with navigation to register
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, Typography, Space, Divider, message } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state (where user was trying to go)
  const from = (location.state as any)?.from?.pathname || '/products';

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      await login(email, password);
      message.success('Login successful! Welcome back!');
      
      // Redirect to where they were trying to go, or to products page
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: 450, 
      margin: '50px auto', 
      padding: '0 16px' 
    }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <LoginOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />
            <Title level={2} style={{ marginTop: 16 }}>
              Welcome Back
            </Title>
            <Text type="secondary">
              Log in to your account to continue shopping
            </Text>
          </div>

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />

          {/* Divider */}
          <Divider plain>Don't have an account?</Divider>

          {/* Register Link */}
          <div style={{ textAlign: 'center' }}>
            <Text>
              New to our store?{' '}
              <Link to="/register" state={{ from: location.state }}>
                Create an account
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;

