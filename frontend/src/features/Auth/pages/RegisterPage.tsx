/**
 * RegisterPage
 * 
 * Registration page with navigation to login
 */
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, Typography, Space, Divider, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm';
import type { RegisterRequest } from '../types';

const { Title, Text } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  // Get the redirect path from location state
  const from = (location.state as any)?.from?.pathname || '/products';

  const handleRegister = async (data: RegisterRequest) => {
    try {
      setLoading(true);
      await register(data);
      message.success('Account created successfully! Welcome!');
      
      // After successful registration and auto-login, redirect
      navigate(from, { replace: true });
    } catch (error: any) {
      message.error(error.message || 'Registration failed');
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
            <UserAddOutlined style={{ fontSize: '3rem', color: '#1890ff' }} />
            <Title level={2} style={{ marginTop: 16 }}>
              Create Account
            </Title>
            <Text type="secondary">
              Join us and start shopping today
            </Text>
          </div>

          {/* Register Form */}
          <RegisterForm onSubmit={handleRegister} loading={loading} />

          {/* Divider */}
          <Divider plain>Already have an account?</Divider>

          {/* Login Link */}
          <div style={{ textAlign: 'center' }}>
            <Text>
              Already registered?{' '}
              <Link to="/login" state={{ from: location.state }}>
                Log in here
              </Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default RegisterPage;

