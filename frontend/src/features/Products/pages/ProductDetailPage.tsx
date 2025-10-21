/**
 * ProductDetailPage
 * 
 * Detailed view of a single product
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Space, Spin, Alert, Descriptions, message } from 'antd';
import { 
  ArrowLeftOutlined, 
  ShoppingCartOutlined,
  DollarOutlined,
  InboxOutlined,
  TagOutlined 
} from '@ant-design/icons';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../Cart';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(Number(id));
  const { addItem } = useCart();

  const handleBack = () => {
    navigate('/products');
  };

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
      message.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert 
          message="Error" 
          description={error} 
          type="error" 
          showIcon 
          action={
            <Button onClick={handleBack}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: 24 }}>
        <Alert 
          message="Product Not Found" 
          description="The product you're looking for doesn't exist." 
          type="warning" 
          showIcon 
          action={
            <Button onClick={handleBack}>
              Back to Products
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack}
        style={{ marginBottom: 24 }}
      >
        Back to Products
      </Button>

      <Card>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Product Image Placeholder */}
          <div style={{
            width: 400,
            height: 400,
            background: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            fontSize: '5rem',
            color: '#ccc'
          }}>
            📦
          </div>

          {/* Product Details */}
          <div style={{ flex: 1 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>{product.name}</h1>
                <Tag color={product.stock > 0 ? 'green' : 'red'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Tag>
                <Tag color="blue">{product.category}</Tag>
              </div>

              <div>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1890ff' }}>
                  ${product.price.toFixed(2)}
                </span>
              </div>

              <p style={{ fontSize: '1.1rem', color: '#666' }}>
                {product.description || 'No description available'}
              </p>

              <Descriptions bordered column={1}>
                <Descriptions.Item label={<><DollarOutlined /> Price</>}>
                  ${product.price.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label={<><InboxOutlined /> Stock</>}>
                  {product.stock} units
                </Descriptions.Item>
                <Descriptions.Item label={<><TagOutlined /> Category</>}>
                  {product.category}
                </Descriptions.Item>
              </Descriptions>

              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ width: 200 }}
              >
                Add to Cart
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;

