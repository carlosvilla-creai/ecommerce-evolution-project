/**
 * CartPage
 * 
 * Main shopping cart page with items and checkout functionality
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Empty, Button, Typography, message } from 'antd';
import { ShoppingOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';

const { Title } = Typography;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal
  } = useCart();

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
    message.success('Quantity updated');
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
    message.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      message.warning('Your cart is empty');
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (items.length === 0) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Shopping Cart</Title>
        <Empty
          description="Your cart is empty"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 60, marginBottom: 40 }}
        >
          <Button
            type="primary"
            size="large"
            icon={<ShoppingOutlined />}
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Shopping Cart ({items.length} items)</Title>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </Button>
      </div>

      {/* Cart Content */}
      <Row gutter={24}>
        {/* Cart Items */}
        <Col xs={24} lg={16}>
          <div style={{ marginBottom: 16 }}>
            {items.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Clear Cart Button */}
          <Button
            danger
            onClick={() => {
              clearCart();
              message.success('Cart cleared');
            }}
          >
            Clear Cart
          </Button>
        </Col>

        {/* Order Summary */}
        <Col xs={24} lg={8}>
          <CartSummary
            subtotal={getSubtotal()}
            onCheckout={handleCheckout}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CartPage;


