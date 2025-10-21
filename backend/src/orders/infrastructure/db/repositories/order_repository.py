"""
SQLAlchemy implementation of IOrderRepository

✅ CLEAN: No SQL injection vulnerabilities
✅ CLEAN: Async/await support
✅ CLEAN: Transaction management
✅ CLEAN: Eager loading of relationships
"""
from typing import List, Optional
from datetime import datetime
from decimal import Decimal
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from ....domain.models.order import Order as DomainOrder
from ....domain.models.order_status import OrderStatus
from ....domain.interfaces.repositories import IOrderRepository
from ..models import OrderORM, OrderItemORM


class OrderRepository(IOrderRepository):
    """
    SQLAlchemy implementation of the Order repository.
    
    ✅ No SQL injection vulnerabilities
    ✅ Proper query parameter binding
    ✅ Transaction support
    ✅ Eager loading to avoid N+1 queries
    """
    
    def __init__(self, session: AsyncSession):
        """
        Initialize repository with database session.
        
        Args:
            session: SQLAlchemy async session
        """
        self.session = session
    
    async def create(self, order: DomainOrder) -> DomainOrder:
        """Create a new order with its items"""
        # Convert domain entity to ORM model
        order_orm = OrderORM.from_domain(order)
        
        # Add to session
        self.session.add(order_orm)
        await self.session.flush()
        
        # Refresh to get relationships
        await self.session.refresh(order_orm, ["items"])
        
        # Convert back to domain entity
        return order_orm.to_domain()
    
    async def get_by_id(self, order_id: int) -> Optional[DomainOrder]:
        """Get order by ID with all items"""
        # ✅ Eager load items to avoid N+1 queries
        stmt = (
            select(OrderORM)
            .options(selectinload(OrderORM.items))
            .where(OrderORM.id == order_id)
        )
        result = await self.session.execute(stmt)
        order_orm = result.scalar_one_or_none()
        
        return order_orm.to_domain() if order_orm else None
    
    async def get_by_user_id(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        status: Optional[OrderStatus] = None
    ) -> List[DomainOrder]:
        """Get all orders for a specific user"""
        # Build query with eager loading
        stmt = (
            select(OrderORM)
            .options(selectinload(OrderORM.items))
            .where(OrderORM.user_id == user_id)
        )
        
        # Apply status filter if provided
        if status:
            stmt = stmt.where(OrderORM.status == status.value)
        
        # Order by creation date (newest first)
        stmt = stmt.order_by(OrderORM.created_at.desc())
        
        # Apply pagination
        stmt = stmt.offset(skip).limit(limit)
        
        # Execute query
        result = await self.session.execute(stmt)
        orders_orm = result.scalars().all()
        
        # Convert to domain entities
        return [order.to_domain() for order in orders_orm]
    
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[OrderStatus] = None,
        user_id: Optional[int] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> List[DomainOrder]:
        """Get all orders with optional filtering"""
        # Build query with eager loading
        stmt = (
            select(OrderORM)
            .options(selectinload(OrderORM.items))
        )
        
        # Build filter conditions
        conditions = []
        
        if status:
            conditions.append(OrderORM.status == status.value)
        
        if user_id:
            conditions.append(OrderORM.user_id == user_id)
        
        if from_date:
            conditions.append(OrderORM.created_at >= from_date)
        
        if to_date:
            conditions.append(OrderORM.created_at <= to_date)
        
        # Apply filters
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        # Order by creation date (newest first)
        stmt = stmt.order_by(OrderORM.created_at.desc())
        
        # Apply pagination
        stmt = stmt.offset(skip).limit(limit)
        
        # Execute query
        result = await self.session.execute(stmt)
        orders_orm = result.scalars().all()
        
        # Convert to domain entities
        return [order.to_domain() for order in orders_orm]
    
    async def update(self, order: DomainOrder) -> DomainOrder:
        """Update an existing order"""
        if not order.id:
            raise ValueError("Order ID is required for update")
        
        # Get existing order
        stmt = (
            select(OrderORM)
            .options(selectinload(OrderORM.items))
            .where(OrderORM.id == order.id)
        )
        result = await self.session.execute(stmt)
        order_orm = result.scalar_one_or_none()
        
        if not order_orm:
            raise ValueError(f"Order with ID {order.id} not found")
        
        # Update fields
        order_orm.status = order.status.value
        order_orm.subtotal = order.subtotal
        order_orm.tax_rate = order.tax_rate
        order_orm.tax_amount = order.tax_amount
        order_orm.shipping_cost = order.shipping_cost
        order_orm.total_amount = order.total_amount
        order_orm.shipping_address = order.shipping_address
        order_orm.payment_method = order.payment_method
        order_orm.payment_status = order.payment_status
        order_orm.notes = order.notes
        order_orm.updated_at = datetime.utcnow()
        
        await self.session.flush()
        await self.session.refresh(order_orm, ["items"])
        
        return order_orm.to_domain()
    
    async def update_status(self, order_id: int, status: OrderStatus) -> DomainOrder:
        """Update order status"""
        # Get existing order
        stmt = (
            select(OrderORM)
            .options(selectinload(OrderORM.items))
            .where(OrderORM.id == order_id)
        )
        result = await self.session.execute(stmt)
        order_orm = result.scalar_one_or_none()
        
        if not order_orm:
            raise ValueError(f"Order with ID {order_id} not found")
        
        # Update status
        order_orm.status = status.value
        order_orm.updated_at = datetime.utcnow()
        
        await self.session.flush()
        
        return order_orm.to_domain()
    
    async def delete(self, order_id: int) -> bool:
        """Hard delete an order"""
        stmt = (
            select(OrderORM)
            .where(OrderORM.id == order_id)
        )
        result = await self.session.execute(stmt)
        order_orm = result.scalar_one_or_none()
        
        if not order_orm:
            return False
        
        await self.session.delete(order_orm)
        await self.session.flush()
        
        return True
    
    async def exists(self, order_id: int) -> bool:
        """Check if order exists"""
        stmt = select(func.count()).select_from(OrderORM).where(
            OrderORM.id == order_id
        )
        result = await self.session.execute(stmt)
        count = result.scalar()
        
        return count > 0
    
    async def count_by_user(self, user_id: int, status: Optional[OrderStatus] = None) -> int:
        """Count orders for a user"""
        stmt = select(func.count()).select_from(OrderORM).where(
            OrderORM.user_id == user_id
        )
        
        if status:
            stmt = stmt.where(OrderORM.status == status.value)
        
        result = await self.session.execute(stmt)
        return result.scalar()
    
    async def count(
        self,
        status: Optional[OrderStatus] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None
    ) -> int:
        """Count all orders with optional filtering"""
        stmt = select(func.count()).select_from(OrderORM)
        
        conditions = []
        
        if status:
            conditions.append(OrderORM.status == status.value)
        
        if from_date:
            conditions.append(OrderORM.created_at >= from_date)
        
        if to_date:
            conditions.append(OrderORM.created_at <= to_date)
        
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        result = await self.session.execute(stmt)
        return result.scalar()


