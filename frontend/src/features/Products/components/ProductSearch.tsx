/**
 * ProductSearch Component
 * 
 * Search bar for products
 */
import React, { useState } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Search } = Input;

interface ProductSearchProps {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onSearch, 
  placeholder = "Search products..." 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  return (
    <Search
      placeholder={placeholder}
      allowClear
      enterButton={<SearchOutlined />}
      size="large"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onSearch={handleSearch}
      style={{ marginBottom: 16 }}
    />
  );
};

export default ProductSearch;

