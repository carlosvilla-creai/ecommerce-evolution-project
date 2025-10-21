/**
 * CartSummary Component
 * 
 * Displays order summary with subtotal, tax, shipping, and total
 */
import React from 'react';
import { Card, Descriptions, Divider, Button, Typography, Space } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface CartSummaryProps {
  subtotal: number;
  taxRate?: number;
  shippingCost?: number;
  onCheckout?: () => void;
  loading?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  taxRate = 0.10,
  shippingCost = 10.00,
  onCheckout,
  loading = false
}) => {
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  return (
    <Card
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Order Summary</span>
        </Space>
      }
      style={{ position: 'sticky', top: 20 }}
    >
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Subtotal">
          <Text strong>${subtotal.toFixed(2)}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label={`Tax (${(taxRate * 100).toFixed(0)}%)`}>
          <Text>${tax.toFixed(2)}</Text>
        </Descriptions.Item>
        
        <Descriptions.Item label="Shipping">
          <Text>${shippingCost.toFixed(2)}</Text>
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ margin: '16px 0' }} />

      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Total:</Title>
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              ${total.toFixed(2)}
            </Title>
          </div>
        </Space>
      </div>

      {onCheckout && (
        <Button
          type="primary"
          size="large"
          block
          icon={<ShoppingCartOutlined />}
          onClick={onCheckout}
          loading={loading}
          disabled={subtotal === 0}
        >
          Proceed to Checkout
        </Button>
      )}

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Free shipping on orders over $50
        </Text>
      </div>
    </Card>
  );
};


