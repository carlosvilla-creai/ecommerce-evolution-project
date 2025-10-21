/**
 * LoginForm Component
 * 
 * Login form with validation and error handling
 */
import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
}

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async (values: LoginFormValues) => {
    try {
      setError(null);
      await onSubmit(values.email, values.password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={handleFinish}
      layout="vertical"
      size="large"
      autoComplete="off"
    >
      {error && (
        <Form.Item>
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </Form.Item>
      )}

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />}
          placeholder="your.email@example.com"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter your password' },
          { min: 8, message: 'Password must be at least 8 characters' }
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Enter your password"
          autoComplete="current-password"
        />
      </Form.Item>

      <Form.Item>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

