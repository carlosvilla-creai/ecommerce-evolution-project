/**
 * ProductCard Component
 * 
 * Displays a single product in a card format with category-based icon placeholders
 */
import React from 'react';
import { Card, Tag, Button, Space } from 'antd';
import { ShoppingCartOutlined, EyeOutlined } from '@ant-design/icons';
import type { Product } from '../types';
import { CategoryIconPlaceholder } from '@shared/utils/categoryIcons';

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
  const formatPrice = (price: number | string) => {
    // Handle both number and string (backend sends Decimal as string)
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          background: '#fafafa'
        }}>
          <CategoryIconPlaceholder category={product.category} size={200} fontSize={64} />
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

