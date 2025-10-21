import React from 'react'
import { Layout, Menu, Badge, Button, Space, Typography } from 'antd'
import { 
  ShoppingCartOutlined, 
  UserOutlined, 
  ShopOutlined,
  HeartOutlined,
  SearchOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../../../features/Cart'

const { Header } = Layout
const { Title } = Typography

// ❌ PROBLEMA: Componente muy grande - should be split into smaller components
// ❌ PROBLEMA: No memoization con React.memo para performance
// ❌ PROBLEMA: No configuración responsive apropiada para mobile
const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getItemCount } = useCart()

  // ❌ PROBLEMA: Mock data hardcodeada - should come from context/state
  // ❌ PROBLEMA: No type safety para el estado
  // ❌ PROBLEMA: No loading states para contadores dinámicos
  const cartItemsCount = getItemCount() // ✅ Day 3: Now using cart context
  const isAuthenticated = false // Will come from auth context in Day 4
  const wishlistCount = 0 // Will be implemented later

  // ❌ PROBLEMA: Menu items hardcodeados - should be configurable
  // ❌ PROBLEMA: No role-based menu filtering
  // ❌ PROBLEMA: No menu items activos/inactivos por permisos
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
    }
    // ❌ PROBLEMA: More menu items will be added but no structure for it
    // TODO Day 4: Profile, Login  
    // TODO Day 5: Admin (if admin user)
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
    console.log('Login clicked - will navigate to login in Day 4')
    // ❌ PROBLEMA: No redirect apropiado después del login
    // navigate('/login') // Will be implemented in Day 4
  }

  const handleProfileClick = () => {
    console.log('Profile clicked - will navigate to profile in Day 4')
    // ❌ PROBLEMA: No dropdown con opciones de perfil
    // navigate('/profile') // Will be implemented in Day 4
  }

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

        {/* ❌ PROBLEMA: User Authentication muy básico */}
        {/* ❌ PROBLEMA: No dropdown con opciones cuando está autenticado */}
        {/* ❌ PROBLEMA: No avatar del usuario */}
        {isAuthenticated ? (
          <Button 
            type="text" 
            icon={<UserOutlined />}
            onClick={handleProfileClick}
            // ❌ PROBLEMA: No dropdown menu con Profile, Orders, Logout
          >
            Profile
          </Button>
        ) : (
          <Button 
            type="primary"
            onClick={handleLoginClick}
            // ❌ PROBLEMA: No loading state durante login
          >
            Login
          </Button>
        )}
      </Space>
    </Header>
  )
}

// ❌ PROBLEMA: No export con React.memo para optimization
export default AppHeader
