/**
 * ProductCard Component
 * 
 * Displays a single product in a card format
 */
import React from 'react';
import { Card, Tag, Button, Space } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onViewDetails, 
  onAddToCart 
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          height: 200, 
          background: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '3rem',
          color: '#ccc'
        }}>
          📦
        </div>
      }
      actions={[
        <Button 
          key="view" 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => onViewDetails?.(product)}
        >
          View
        </Button>,
        <Button 
          key="cart" 
          type="primary" 
          icon={<ShoppingCartOutlined />}
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      ]}
    >
      <Card.Meta 
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{product.name}</span>
            <Tag color={product.stock > 0 ? 'green' : 'red'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Tag>
          </div>
        }
        description={
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ 
              height: 60, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              marginBottom: 8 
            }}>
              {product.description || 'No description available'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1890ff' }}>
                {formatPrice(product.price)}
              </span>
              <Tag color="blue">{product.category}</Tag>
            </div>
          </Space>
        } 
      />
    </Card>
  );
};

export default ProductCard;

