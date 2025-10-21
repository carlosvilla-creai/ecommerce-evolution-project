import React from 'react'
import { Layout, Menu, Badge, Button, Space, Typography, Dropdown, message } from 'antd'
import type { MenuProps } from 'antd'
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  ShopOutlined,
  HeartOutlined,
  SearchOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  LoginOutlined,
  DashboardOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../../features/Cart'
import { useAuth } from '../../../features/Auth'

const { Header } = Layout
const { Title } = Typography

// ❌ PROBLEMA: Componente muy grande - should be split into smaller components
// ❌ PROBLEMA: No memoization con React.memo para performance
// ❌ PROBLEMA: No configuración responsive apropiada para mobile
const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getItemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth() // ✅ Day 4: Now using auth context

  const cartItemsCount = getItemCount()
  const wishlistCount = 0 // Will be implemented later

  // ✅ Day 5: Dynamic menu items with role-based filtering
  const menuItems = [
    {
      key: '/',
      icon: <ShopOutlined />,
      label: 'Products',
      onClick: () => navigate('/products')
    },
    {
      key: '/orders',
      icon: <ShoppingOutlined />,
      label: 'My Orders',
      onClick: () => navigate('/orders')
    },
    // ✅ Day 5: Admin menu item (only for admins)
    ...(user?.role === 'admin' ? [{
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Admin',
      onClick: () => navigate('/admin')
    }] : [])
  ]

  // ❌ PROBLEMA: Event handlers inline - should use useCallback for optimization
  // ❌ PROBLEMA: No error handling en navegación
  // ❌ PROBLEMA: No analytics tracking en clicks
  const handleCartClick = () => {
    navigate('/cart') // ✅ Day 3: Navigate to cart page
  }

  const handleWishlistClick = () => {
    console.log('Wishlist clicked - will be implemented later')
    // ❌ PROBLEMA: No implementación de wishlist
    // ❌ PROBLEMA: No persistencia local de wishlist
    // navigate('/wishlist')
  }

  const handleLoginClick = () => {
    navigate('/login') // ✅ Day 4: Navigate to login
  }

  const handleLogout = () => {
    logout()
    message.success('Logged out successfully!')
    navigate('/products') // Redirect to products after logout
  }

  const handleProfileClick = () => {
    navigate('/profile') // ✅ Day 4: Navigate to profile
  }

  // ✅ Day 4: User dropdown menu
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: handleProfileClick,
    },
    {
      key: 'orders',
      icon: <ShoppingOutlined />,
      label: 'My Orders',
      onClick: () => navigate('/orders'),
    },
    // ✅ Day 5: Admin dashboard link (only for admins)
    ...(user?.role === 'admin' ? [
      {
        type: 'divider' as const,
      },
      {
        key: 'admin',
        icon: <DashboardOutlined />,
        label: 'Admin Dashboard',
        onClick: () => navigate('/admin'),
      }
    ] : []),
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ]

  // ❌ PROBLEMA: Return muy grande - should be split into render functions
  // ❌ PROBLEMA: Estilos inline - should use CSS-in-JS or styled components
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#fff',
      borderBottom: '1px solid #f0f0f0'
      // ❌ PROBLEMA: No box-shadow para depth
      // ❌ PROBLEMA: No sticky behavior
    }}>
      {/* ❌ PROBLEMA: Logo and Navigation section muy grande */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {/* ❌ PROBLEMA: Logo hardcodeado - should be configurable */}
        {/* ❌ PROBLEMA: No logo image - just emoji */}
        {/* ❌ PROBLEMA: No hover effects en logo */}
        <Title 
          level={3} 
          style={{ 
            margin: 0, 
            marginRight: '32px',
            color: '#1890ff',
            cursor: 'pointer'
            // ❌ PROBLEMA: No transition effects
          }}
          onClick={() => navigate('/')}
        >
          🛒 E-commerce
        </Title>
        
        {/* ❌ PROBLEMA: Menu sin configuración avanzada */}
        {/* ❌ PROBLEMA: No mobile hamburger menu */}
        {/* ❌ PROBLEMA: No keyboard navigation support */}
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ 
            border: 'none',
            background: 'transparent',
            flex: 1
            // ❌ PROBLEMA: No custom styling para active items
          }}
        />
      </div>

      {/* ❌ PROBLEMA: Right Side Actions sin responsive behavior */}
      {/* ❌ PROBLEMA: No collapse en mobile */}
      <Space size="middle">
        {/* ❌ PROBLEMA: Search placeholder sin implementación real */}
        {/* ❌ PROBLEMA: No search autocomplete */}
        {/* ❌ PROBLEMA: No search history */}
        <Button 
          type="text" 
          icon={<SearchOutlined />}
          onClick={() => console.log('Search - will be implemented later')}
          // ❌ PROBLEMA: No tooltip
          // ❌ PROBLEMA: No keyboard shortcut (Ctrl+K)
        >
          Search
        </Button>

        {/* ❌ PROBLEMA: Wishlist sin implementación */}
        {/* ❌ PROBLEMA: Badge sin animación cuando cambia el count */}
        <Badge count={wishlistCount} size="small">
          <Button 
            type="text" 
            icon={<HeartOutlined />}
            onClick={handleWishlistClick}
            // ❌ PROBLEMA: No tooltip describiendo la funcionalidad
          />
        </Badge>

        {/* ❌ PROBLEMA: Shopping Cart sin preview del contenido */}
        {/* ❌ PROBLEMA: No dropdown preview del carrito */}
        <Badge count={cartItemsCount} size="small">
          <Button 
            type="text" 
            icon={<ShoppingCartOutlined />}
            onClick={handleCartClick}
            // ❌ PROBLEMA: No loading state cuando se actualiza el carrito
          />
        </Badge>

        {/* ✅ Day 4: User Authentication with dropdown */}
        {isAuthenticated && user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button 
              type="text" 
              icon={<UserOutlined />}
            >
              {user.first_name}
            </Button>
          </Dropdown>
        ) : (
          <Space>
            <Button 
              type="text"
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
            >
              Login
            </Button>
            <Button 
              type="primary"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Space>
        )}
      </Space>
    </Header>
  )
}

// ❌ PROBLEMA: No export con React.memo para optimization
export default AppHeader
