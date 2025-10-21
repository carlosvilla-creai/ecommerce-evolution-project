/**
 * ProductList Component
 * 
 * Displays a grid of products with loading and empty states
 */
import React from 'react';
import { Row, Col, Spin, Empty, Alert } from 'antd';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  error,
  onViewDetails,
  onAddToCart
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" tip="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        message="Error loading products" 
        description={error} 
        type="error" 
        showIcon 
      />
    );
  }

  if (!products || products.length === 0) {
    return <Empty description="No products found" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
          <ProductCard 
            product={product} 
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;

