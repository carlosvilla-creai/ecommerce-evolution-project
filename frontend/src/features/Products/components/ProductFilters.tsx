/**
 * ProductFilters Component
 * 
 * Provides filtering controls for products
 */
import React, { useState } from 'react';
import { Card, Select, InputNumber, Button, Space, Row, Col } from 'antd';
import { FilterOutlined, ClearOutlined } from '@ant-design/icons';
import type { ProductFilters } from '../types';

const { Option } = Select;

interface ProductFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
  availableCategories?: string[];
}

const ProductFiltersComponent: React.FC<ProductFiltersProps> = ({ 
  onFilterChange,
  availableCategories = ['Electronics', 'Home', 'Sports']
}) => {
  const [category, setCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();

  const handleApplyFilters = () => {
    onFilterChange({
      category,
      min_price: minPrice,
      max_price: maxPrice
    });
  };

  const handleClearFilters = () => {
    setCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    onFilterChange({});
  };

  return (
    <Card 
      title={<><FilterOutlined /> Filters</>} 
      size="small"
      style={{ marginBottom: 16 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Category
            </label>
            <Select
              style={{ width: '100%' }}
              placeholder="Select category"
              value={category}
              onChange={setCategory}
              allowClear
            >
              {availableCategories.map(cat => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Min Price
            </label>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="0.00"
              value={minPrice}
              onChange={(value) => setMinPrice(value || undefined)}
              prefix="$"
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
              Max Price
            </label>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              placeholder="1000.00"
              value={maxPrice}
              onChange={(value) => setMaxPrice(value || undefined)}
              prefix="$"
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginTop: 30 }}>
            <Space>
              <Button 
                type="primary" 
                icon={<FilterOutlined />}
                onClick={handleApplyFilters}
              >
                Apply
              </Button>
              <Button 
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductFiltersComponent;

