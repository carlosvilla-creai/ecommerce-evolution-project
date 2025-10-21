/**
 * OrderItemList Component
 * 
 * Displays a list of items in an order
 */
import React from 'react';
import { Table, Typography } from 'antd';
import type { OrderItem } from '../types';

const { Text } = Typography;

interface OrderItemListProps {
  items: OrderItem[];
}

const OrderItemList: React.FC<OrderItemListProps> = ({ items }) => {
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toFixed(2)}`;
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product_name',
      key: 'product_name',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      width: 100
    },
    {
      title: 'Unit Price',
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: 'right' as const,
      width: 120,
      render: (price: number) => formatPrice(price)
    },
    {
      title: 'Subtotal',
      dataIndex: 'subtotal',
      key: 'subtotal',
      align: 'right' as const,
      width: 120,
      render: (subtotal: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          {formatPrice(subtotal)}
        </Text>
      )
    }
  ];

  return (
    <Table
      dataSource={items}
      columns={columns}
      rowKey="id"
      pagination={false}
      size="small"
    />
  );
};

export default OrderItemList;

