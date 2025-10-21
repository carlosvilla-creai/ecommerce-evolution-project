/**
 * Admin Products Management
 * 
 * Full CRUD interface for managing products
 */
import React, { useEffect, useState } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Input, 
  InputNumber, 
  Switch,
  message,
  Popconfirm,
  Card
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { adminApi } from '../api/adminApi';
import type { AdminProduct, CreateProductRequest, UpdateProductRequest } from '../types';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * pageSize;
      const response = await adminApi.getAllProducts(skip, pageSize);
      setProducts(response.products);
      setTotal(response.total);
    } catch (error: any) {
      message.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ is_active: true }); // Default to active
    setIsModalVisible(true);
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleDelete = async (productId: number) => {
    try {
      await adminApi.deleteProduct(productId, false); // Soft delete
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      message.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingProduct) {
        // Update existing product
        await adminApi.updateProduct(editingProduct.id, values as UpdateProductRequest);
        message.success('Product updated successfully');
      } else {
        // Create new product
        await adminApi.createProduct(values as CreateProductRequest);
        message.success('Product created successfully');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error: any) {
      if (error.errorFields) {
        // Validation error
        return;
      }
      message.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error('Error saving product:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const columns: ColumnsType<AdminProduct> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => `$${parseFloat(price.toString()).toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock: number) => (
        <Tag color={stock > 10 ? 'green' : stock > 0 ? 'orange' : 'red'}>
          {stock}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive: boolean) => (
        <Tag 
          icon={isActive ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={isActive ? 'success' : 'default'}
        >
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this product?"
            description="This will deactivate the product."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Product Management</h2>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Add Product
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingProduct ? 'Update' : 'Create'}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ is_active: true }}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: 'Please enter product name' },
              { min: 1, max: 255, message: 'Name must be between 1 and 255 characters' }
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[
              { required: true, message: 'Please enter category' },
              { max: 100, message: 'Category must be less than 100 characters' }
            ]}
          >
            <Input placeholder="Enter category" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="$"
              min={0.01}
              step={0.01}
              precision={2}
              placeholder="0.00"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Stock Quantity"
            rules={[
              { required: true, message: 'Please enter stock quantity' },
              { type: 'number', min: 0, message: 'Stock must be 0 or greater' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { max: 2000, message: 'Description must be less than 2000 characters' }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter product description (optional)"
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;

