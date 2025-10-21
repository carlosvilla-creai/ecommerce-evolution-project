import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import AppHeader from '@shared/components/Layout/Header'
import HomePage from './pages/HomePage'
import { ProductsPage, ProductDetailPage } from './features/Products'
import { CartProvider, CartPage } from './features/Cart'
import { CheckoutPage, OrderHistoryPage, OrderDetailPage } from './features/Orders'
import { 
  AuthProvider, 
  LoginPage, 
  RegisterPage, 
  ProfilePage, 
  ProtectedRoute 
} from './features/Auth'
import {
  AdminRoute,
  AdminDashboard,
  AdminProductsPage,
  AdminOrdersPage
} from './features/Admin'

const { Content, Footer } = Layout

// ❌ PROBLEMA: No error boundaries para manejar crashes
// ❌ PROBLEMA: No loading states globales
// ❌ PROBLEMA: No configuración de rutas protegidas
// ❌ PROBLEMA: No lazy loading de rutas
// ❌ PROBLEMA: No configuración de SEO (meta tags, etc.)
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Layout style={{ minHeight: '100vh' }}>
            <AppHeader />
            
            <Content style={{ padding: '24px 50px' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* ✅ Day 2: Products feature routes */}
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                
                {/* ✅ Day 3: Cart routes (public) */}
                <Route path="/cart" element={<CartPage />} />
                
                {/* ✅ Day 4: Auth routes (public) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* ✅ Day 4: Protected routes (require authentication) */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:orderId" 
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* ✅ Day 5: Admin routes (admin-only) */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <AdminRoute>
                      <AdminProductsPage />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/orders" 
                  element={
                    <AdminRoute>
                      <AdminOrdersPage />
                    </AdminRoute>
                  } 
                />
                
                {/* ❌ PROBLEMA: No 404 route */}
                {/* ❌ PROBLEMA: No catch-all route */}
              </Routes>
            </Content>
            
            <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
              E-commerce Evolution ©2024 - Learning Project
            </Footer>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
