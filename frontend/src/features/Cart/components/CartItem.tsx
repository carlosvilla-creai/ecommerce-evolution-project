/**
 * CartItem Component
 * 
 * Displays a single item in the shopping cart with quantity controls
 */
import React from 'react';
import { Card, InputNumber, Button, Typography, Row, Col, Image, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { CartItem as CartItemType } from '../context/CartContext';

const { Text, Title } = Typography;

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const subtotal = price * quantity;

  const handleQuantityChange = (value: number | null) => {
    if (value && value > 0 && value <= product.stock) {
      onUpdateQuantity(product.id, value);
    }
  };

  const handleRemove = () => {
    onRemove(product.id);
  };

  return (
    <Card
      style={{ marginBottom: 16 }}
      hoverable
    >
      <Row gutter={16} align="middle">
        {/* Product Image */}
        <Col xs={24} sm={6} md={4}>
          <Image
            src={`https://via.placeholder.com/150x150/1890ff/FFFFFF?text=${product.name.replace(/\s/g, '+')}`}
            alt={product.name}
            style={{ width: '100%', borderRadius: 8 }}
            preview={false}
          />
        </Col>

        {/* Product Details */}
        <Col xs={24} sm={8} md={10}>
          <Title level={5} style={{ margin: 0 }}>
            {product.name}
          </Title>
          <Text type="secondary">{product.category}</Text>
          <br />
          <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
            ${price.toFixed(2)}
          </Text>
        </Col>

        {/* Quantity Control */}
        <Col xs={12} sm={5} md={4}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text type="secondary">Quantity:</Text>
            <InputNumber
              min={1}
              max={product.stock}
              value={quantity}
              onChange={handleQuantityChange}
              style={{ width: '100%' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Max: {product.stock}
            </Text>
          </Space>
        </Col>

        {/* Subtotal */}
        <Col xs={12} sm={3} md={4} style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="small">
            <Text type="secondary">Subtotal:</Text>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              ${subtotal.toFixed(2)}
            </Title>
          </Space>
        </Col>

        {/* Remove Button */}
        <Col xs={24} sm={2} md={2} style={{ textAlign: 'center' }}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            size="large"
          >
            Remove
          </Button>
        </Col>
      </Row>
    </Card>
  );
};


