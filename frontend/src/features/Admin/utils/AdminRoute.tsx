/**
 * Admin Route Protection
 * 
 * Higher-Order Component that protects routes requiring admin role
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Result, Spin, Button } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useAuth } from '@features/Auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh' 
      }}>
        <Spin size="large" tip="Checking permissions..." />
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated but not admin - show access denied
  if (user && user.role !== 'admin') {
    return (
      <div style={{ padding: '50px' }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          icon={<LockOutlined style={{ fontSize: 72, color: '#faad14' }} />}
          extra={
            <Button type="primary" href="/products">
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  // User is authenticated and is admin
  return <>{children}</>;
};

export default AdminRoute;

