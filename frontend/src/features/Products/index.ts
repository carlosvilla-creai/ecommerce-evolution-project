/**
 * Products Feature Module
 * 
 * Exports all Products feature components, pages, and hooks
 */

// Pages
export { default as ProductsPage } from './pages/ProductsPage';
export { default as ProductDetailPage } from './pages/ProductDetailPage';

// Components
export { default as ProductCard } from './components/ProductCard';
export { default as ProductList } from './components/ProductList';
export { default as ProductFilters } from './components/ProductFilters';
export { default as ProductSearch } from './components/ProductSearch';

// Hooks
export { useProducts } from './hooks/useProducts';
export { useProduct } from './hooks/useProduct';

// Types
export type { ProductFilters as ProductFiltersType } from './types';

