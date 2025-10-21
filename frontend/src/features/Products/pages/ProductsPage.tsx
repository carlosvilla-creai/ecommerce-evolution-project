/**
 * ProductsPage
 * 
 * Main products listing page with search and filters
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Pagination } from 'antd';
import ProductList from '../components/ProductList';
import ProductSearch from '../components/ProductSearch';
import ProductFilters from '../components/ProductFilters';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../../Cart';
import type { Product } from '../types';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { products, loading, error, total, setFilters, filters } = useProducts();
  const { addItem } = useCart();

  const handleViewDetails = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    message.success(`${product.name} added to cart!`);
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ ...filters, search: searchTerm, skip: 0 });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, skip: 0 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setFilters({ ...filters, skip: (page - 1) * pageSize, limit: pageSize });
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 24 }}>Products</h1>
      
      <ProductSearch onSearch={handleSearch} />
      
      <ProductFilters onFilterChange={handleFilterChange} />
      
      <ProductList 
        products={products}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onAddToCart={handleAddToCart}
      />

      {total > 0 && !loading && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Pagination
            current={(filters.skip || 0) / (filters.limit || 20) + 1}
            pageSize={filters.limit || 20}
            total={total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Total ${total} products`}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsPage;

