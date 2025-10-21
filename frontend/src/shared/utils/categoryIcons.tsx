/**
 * Category Icon Utility
 * 
 * Maps product categories to Ant Design icons with gradient backgrounds
 */
import React from 'react';
import {
  MobileOutlined,
  HomeOutlined,
  TrophyOutlined,
  ShoppingOutlined,
  BookOutlined,
  CoffeeOutlined,
  BulbOutlined,
  CarOutlined,
  HeartOutlined,
  ToolOutlined,
  CameraOutlined,
  GiftOutlined
} from '@ant-design/icons';

interface CategoryIcon {
  icon: React.ReactNode;
  gradient: string;
  emoji: string;
}

const categoryIconMap: Record<string, CategoryIcon> = {
  electronics: {
    icon: <MobileOutlined />,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    emoji: '📱'
  },
  home: {
    icon: <HomeOutlined />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '🏠'
  },
  sports: {
    icon: <TrophyOutlined />,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '⚽'
  },
  fashion: {
    icon: <HeartOutlined />,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    emoji: '👕'
  },
  books: {
    icon: <BookOutlined />,
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    emoji: '📚'
  },
  food: {
    icon: <CoffeeOutlined />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    emoji: '🍕'
  },
  toys: {
    icon: <GiftOutlined />,
    gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    emoji: '🎁'
  },
  automotive: {
    icon: <CarOutlined />,
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    emoji: '🚗'
  },
  tools: {
    icon: <ToolOutlined />,
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    emoji: '🔧'
  },
  cameras: {
    icon: <CameraOutlined />,
    gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
    emoji: '📷'
  }
};

// Default for unknown categories
const defaultIcon: CategoryIcon = {
  icon: <ShoppingOutlined />,
  gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  emoji: '🛍️'
};

/**
 * Get icon configuration for a category
 */
export const getCategoryIcon = (category: string): CategoryIcon => {
  const normalizedCategory = category.toLowerCase().trim();
  return categoryIconMap[normalizedCategory] || defaultIcon;
};

/**
 * Render a category icon with gradient background
 */
export const CategoryIconPlaceholder: React.FC<{
  category: string;
  size?: number;
  fontSize?: number;
}> = ({ category, size = 200, fontSize = 64 }) => {
  const { icon, gradient } = getCategoryIcon(category);

  return (
    <div
      style={{
        width: size,
        height: size,
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize,
        color: 'white',
        borderRadius: '8px'
      }}
    >
      {icon}
    </div>
  );
};

