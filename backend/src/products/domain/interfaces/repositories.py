"""
Product Repository Interface

This defines the contract for data access without specifying implementation.
Follows the Dependency Inversion Principle - domain doesn't depend on infrastructure.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from decimal import Decimal

from ..models.product import Product


class IProductRepository(ABC):
    """
    Abstract repository interface for Product domain entity.
    
    Infrastructure layer will implement this interface using SQLAlchemy,
    but the domain layer doesn't know or care about that.
    """
    
    @abstractmethod
    async def create(self, product: Product) -> Product:
        """
        Create a new product.
        
        Args:
            product: Product entity to create
            
        Returns:
            Created product with ID assigned
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """
        Get product by ID.
        
        Args:
            product_id: Product ID
            
        Returns:
            Product if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        min_price: Optional[Decimal] = None,
        max_price: Optional[Decimal] = None,
        search: Optional[str] = None,
        active_only: bool = True
    ) -> List[Product]:
        """
        Get all products with optional filtering.
        
        Args:
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            category: Filter by category
            min_price: Minimum price filter
            max_price: Maximum price filter
            search: Search term for product name
            active_only: Return only active products
            
        Returns:
            List of products matching filters
        """
        pass
    
    @abstractmethod
    async def update(self, product: Product) -> Product:
        """
        Update an existing product.
        
        Args:
            product: Product entity with updated data
            
        Returns:
            Updated product
            
        Raises:
            ValueError: If product doesn't exist
        """
        pass
    
    @abstractmethod
    async def delete(self, product_id: int) -> bool:
        """
        Delete a product (hard delete).
        
        Args:
            product_id: Product ID to delete
            
        Returns:
            True if deleted, False if not found
        """
        pass
    
    @abstractmethod
    async def exists(self, product_id: int) -> bool:
        """
        Check if product exists.
        
        Args:
            product_id: Product ID to check
            
        Returns:
            True if exists, False otherwise
        """
        pass
    
    @abstractmethod
    async def count(
        self,
        category: Optional[str] = None,
        active_only: bool = True
    ) -> int:
        """
        Count products with optional filtering.
        
        Args:
            category: Filter by category
            active_only: Count only active products
            
        Returns:
            Total count of products
        """
        pass

