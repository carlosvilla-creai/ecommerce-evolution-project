/**
 * ProfilePage
 * 
 * User profile page with viewing and editing capabilities
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Form, 
  Input,
  message,
  Modal
} from 'antd';
import { 
  UserOutlined, 
  EditOutlined, 
  ArrowLeftOutlined,
  MailOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return null; // Protected route will redirect
  }

  const handleEdit = () => {
    form.setFieldsValue({
      first_name: user.first_name,
      last_name: user.last_name,
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  const handleSave = async (values: any) => {
    try {
      setLoading(true);
      await updateProfile({
        first_name: values.first_name,
        last_name: values.last_name,
      });
      message.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <Space style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/products')}
        >
          Back
        </Button>
      </Space>

      <Title level={2}>
        <UserOutlined /> My Profile
      </Title>

      {/* Profile Card */}
      <Card
        title={
          <Space>
            <UserOutlined />
            <span>Account Information</span>
          </Space>
        }
        extra={
          !isEditing && (
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )
        }
      >
        {!isEditing ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label={<><UserOutlined /> Full Name</>}>
              <Text strong>{user.full_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="First Name">
              {user.first_name}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {user.last_name}
            </Descriptions.Item>
            <Descriptions.Item label={<><MailOutlined /> Email</>}>
              {user.email}
            </Descriptions.Item>
            <Descriptions.Item label="Role">
              <Tag color={user.role === 'admin' ? 'red' : 'blue'}>
                {user.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {user.is_active ? (
                <Tag icon={<CheckCircleOutlined />} color="success">
                  Active
                </Tag>
              ) : (
                <Tag color="default">Inactive</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Account Created">
              {formatDate(user.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated">
              {formatDate(user.updated_at)}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                { required: true, message: 'Please enter your first name' },
                { min: 1, max: 100, message: 'First name must be between 1 and 100 characters' }
              ]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                { required: true, message: 'Please enter your last name' },
                { min: 1, max: 100, message: 'Last name must be between 1 and 100 characters' }
              ]}
            >
              <Input placeholder="Enter your last name" />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                >
                  Save Changes
                </Button>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>

      {/* Quick Actions */}
      <Card
        title="Quick Actions"
        style={{ marginTop: 24 }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="default" 
            block 
            onClick={() => navigate('/orders')}
          >
            View My Orders
          </Button>
          <Button 
            type="default" 
            block 
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ProfilePage;

