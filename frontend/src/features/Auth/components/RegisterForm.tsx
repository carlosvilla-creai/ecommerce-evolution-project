/**
 * RegisterForm Component
 * 
 * Registration form with validation and error handling
 */
import React, { useState } from 'react';
import { Form, Input, Button, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import type { RegisterRequest } from '../types';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => Promise<void>;
  loading?: boolean;
}

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async (values: RegisterFormValues) => {
    try {
      setError(null);
      
      const data: RegisterRequest = {
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      };
      
      await onSubmit(data);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={handleFinish}
      layout="vertical"
      size="large"
      autoComplete="off"
    >
      {error && (
        <Form.Item>
          <Alert
            message="Registration Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </Form.Item>
      )}

      <Form.Item
        name="first_name"
        label="First Name"
        rules={[
          { required: true, message: 'Please enter your first name' },
          { min: 1, message: 'First name must be at least 1 character' },
          { max: 100, message: 'First name must be less than 100 characters' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />}
          placeholder="John"
          autoComplete="given-name"
        />
      </Form.Item>

      <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
          { required: true, message: 'Please enter your last name' },
          { min: 1, message: 'Last name must be at least 1 character' },
          { max: 100, message: 'Last name must be less than 100 characters' }
        ]}
      >
        <Input 
          prefix={<UserOutlined />}
          placeholder="Doe"
          autoComplete="family-name"
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' }
        ]}
      >
        <Input 
          prefix={<MailOutlined />}
          placeholder="your.email@example.com"
          autoComplete="email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          { required: true, message: 'Please enter a password' },
          { min: 8, message: 'Password must be at least 8 characters' },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
          }
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Create a strong password"
          autoComplete="new-password"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder="Confirm your password"
          autoComplete="new-password"
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;

