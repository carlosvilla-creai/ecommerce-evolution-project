/**
 * CheckoutPage
 * 
 * Checkout flow page with cart summary and checkout form
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, Divider, message, Button, Space, Result } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useCart } from '../../Cart/context/CartContext';
import { useCreateOrder } from '../hooks/useCreateOrder';
import CheckoutForm from '../components/CheckoutForm';
import type { CheckoutFormData } from '../types';

const { Title, Text } = Typography;

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { createOrder, loading, error, success } = useCreateOrder();
  const [orderId, setOrderId] = React.useState<number | null>(null);

  // Check if cart is empty
  if (items.length === 0 && !success) {
    return (
      <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 16px' }}>
        <Result
          status="warning"
          title="Your cart is empty"
          subTitle="Please add some items to your cart before checking out."
          extra={
            <Button type="primary" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          }
        />
      </div>
    );
  }

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  const handleCheckout = async (formData: CheckoutFormData) => {
    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      // Create order
      const order = await createOrder({
        items: orderItems,
        shipping_address: formData.shipping_address,
        billing_address: formData.billing_address,
        notes: formData.notes
      });

      if (order) {
        setOrderId(order.id);
        message.success('Order placed successfully!');
        clearCart();
      } else {
        message.error(error || 'Failed to create order');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      message.error('Failed to place order. Please try again.');
    }
  };

  // Success state
  if (success && orderId) {
    return (
      <div style={{ maxWidth: 600, margin: '50px auto', padding: '0 16px' }}>
        <Result
          status="success"
          title="Order Placed Successfully!"
          subTitle={`Your order #${orderId} has been placed. We'll send you a confirmation email shortly.`}
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          extra={[
            <Button 
              type="primary" 
              key="orders" 
              onClick={() => navigate('/orders')}
            >
              View My Orders
            </Button>,
            <Button 
              key="continue" 
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          ]}
        />
      </div>
    );
  }

  // Checkout form
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <Space style={{ marginBottom: 24 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/cart')}
        >
          Back to Cart
        </Button>
      </Space>

      <Title level={2}>Checkout</Title>

      <Row gutter={[24, 24]}>
        {/* Left: Checkout Form */}
        <Col xs={24} lg={14}>
          <CheckoutForm onSubmit={handleCheckout} loading={loading} />
        </Col>

        {/* Right: Order Summary */}
        <Col xs={24} lg={10}>
          <Card title="Order Summary" style={{ position: 'sticky', top: 24 }}>
            {items.map((item) => (
              <div 
                key={item.product.id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: 12 
                }}
              >
                <div>
                  <Text strong>{item.product.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Qty: {item.quantity} × {formatPrice(item.product.price)}
                  </Text>
                </div>
                <Text strong>{formatPrice(item.product.price * item.quantity)}</Text>
              </div>
            ))}

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Subtotal:</Text>
              <Text>{formatPrice(total)}</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Tax (10%):</Text>
              <Text>{formatPrice(total * 0.10)}</Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text>Shipping:</Text>
              <Text>{formatPrice(10.00)}</Text>
            </div>

            <Divider />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={4} style={{ margin: 0 }}>Total:</Title>
              <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                {formatPrice(total + (total * 0.10) + 10.00)}
              </Title>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;

