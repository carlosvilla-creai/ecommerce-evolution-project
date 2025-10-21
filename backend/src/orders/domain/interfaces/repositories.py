"""
Order Repository Interface

Defines the contract for order data access without specifying implementation.
"""
from abc import ABC, abstractmethod
from typing import List, Optional
from datetime import datetime

from ..models.order import Order
from ..models.order_status import OrderStatus


class IOrderRepository(ABC):
    """
    Abstract repository interface for Order domain entity.
    
    Infrastructure layer will implement this using SQLAlchemy.
    """
    
    @abstractmethod
    async def create(self, order: Order) -> Order:
        """
        Create a new order with its items.
        
        Args:
            order: Order entity to create
            
        Returns:
            Created order with ID assigned
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, order_id: int) -> Optional[Order]:
        """
        Get order by ID with all items.
        
        Args:
            order_id: Order ID
            
        Returns:
            Order if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def get_by_user_id(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[OrderStatus] = None
    ) -> List[Order]:
        """
        Get all orders for a specific user.
        
        Args:
            user_id: User ID
            skip: Number of records to skip
            limit: Maximum number of records
            status: Filter by status (optional)
            
        Returns:
            List of user's orders
        """
        pass
    
    @abstractmethod
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[OrderStatus] = None,
        user_id: Optional[int] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[Order]:
        """
        Get all orders with optional filtering.
        
        Args:
            skip: Number of records to skip
            limit: Maximum number of records
            status: Filter by status
            user_id: Filter by user
            from_date: Filter orders created after this date
            to_date: Filter orders created before this date
            
        Returns:
            List of orders matching filters
        """
        pass
    
    @abstractmethod
    async def update(self, order: Order) -> Order:
        """
        Update an existing order.
        
        Args:
            order: Order entity with updated data
            
        Returns:
            Updated order
        """
        pass
    
    @abstractmethod
    async def update_status(self, order_id: int, status: OrderStatus) -> Order:
        """
        Update order status.
        
        Args:
            order_id: Order ID
            status: New status
            
        Returns:
            Updated order
        """
        pass
    
    @abstractmethod
    async def delete(self, order_id: int) -> bool:
        """
        Delete an order (hard delete).
        
        Args:
            order_id: Order ID to delete
            
        Returns:
            True if deleted, False if not found
        """
        pass
    
    @abstractmethod
    async def exists(self, order_id: int) -> bool:
        """
        Check if order exists.
        
        Args:
            order_id: Order ID to check
            
        Returns:
            True if exists, False otherwise
        """
        pass
    
    @abstractmethod
    async def count_by_user(self, user_id: int, status: Optional[OrderStatus] = None) -> int:
        """
        Count orders for a user.
        
        Args:
            user_id: User ID
            status: Filter by status (optional)
            
        Returns:
            Count of orders
        """
        pass
    
    @abstractmethod
    async def count(
        self,
        status: Optional[OrderStatus] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> int:
        """
        Count all orders with optional filtering.
        
        Args:
            status: Filter by status
            from_date: Filter orders created after this date
            to_date: Filter orders created before this date
            
        Returns:
            Total count of orders
        """
        pass


