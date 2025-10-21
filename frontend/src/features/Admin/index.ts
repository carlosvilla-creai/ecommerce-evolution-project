/**
 * Admin Feature Module
 * 
 * Barrel export for Admin feature components and utilities
 */

// Pages
export { default as AdminDashboard } from './pages/AdminDashboard';
export { default as AdminProductsPage } from './pages/AdminProductsPage';
export { default as AdminOrdersPage } from './pages/AdminOrdersPage';

// Utils
export { default as AdminRoute } from './utils/AdminRoute';

// Types
export * from './types';

// API
export { adminApi } from './api/adminApi';

