"""
SQLAlchemy ORM Models for Orders

✅ FIXED: Using SQLAlchemy ORM instead of raw SQL
✅ FIXED: Proper data types (DECIMAL for prices)
✅ FIXED: Foreign keys and relationships
✅ FIXED: Indexes for performance
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    Column, Integer, String, DECIMAL, DateTime, ForeignKey, Index, Text
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from src.shared.database import Base
from ...domain.models.order import Order as DomainOrder
from ...domain.models.order_item import OrderItem as DomainOrderItem
from ...domain.models.order_status import OrderStatus


class OrderItemORM(Base):
    """
    SQLAlchemy ORM model for OrderItem entity.
    
    Represents individual items within an order.
    """
    __tablename__ = "order_items"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    
    # Item details
    product_name = Column(String(255), nullable=False)  # Snapshot at time of order
    quantity = Column(Integer, nullable=False)
    unit_price = Column(DECIMAL(10, 2), nullable=False)  # ✅ DECIMAL for money
    
    # Metadata
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    
    # Relationships
    order = relationship("OrderORM", back_populates="items")
    
    # ✅ Indexes for performance
    __table_args__ = (
        Index('idx_order_item_order_id', 'order_id'),
        Index('idx_order_item_product_id', 'product_id'),
    )
    
    def to_domain(self) -> DomainOrderItem:
        """Convert ORM model to domain entity"""
        return DomainOrderItem(
            id=self.id,
            order_id=self.order_id,
            product_id=self.product_id,
            product_name=self.product_name,
            quantity=self.quantity,
            unit_price=Decimal(str(self.unit_price)),
            created_at=self.created_at
        )
    
    @staticmethod
    def from_domain(item: DomainOrderItem) -> 'OrderItemORM':
        """Create ORM model from domain entity"""
        return OrderItemORM(
            id=item.id,
            order_id=item.order_id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
            created_at=item.created_at
        )


class OrderORM(Base):
    """
    SQLAlchemy ORM model for Order entity.
    
    Represents a customer order with multiple items.
    """
    __tablename__ = "orders"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Order status
    status = Column(String(50), nullable=False, default="pending", index=True)
    
    # Financial details
    subtotal = Column(DECIMAL(10, 2), nullable=False, default=0)
    tax_rate = Column(DECIMAL(5, 4), nullable=False, default=0.10)  # 10% default
    tax_amount = Column(DECIMAL(10, 2), nullable=False, default=0)
    shipping_cost = Column(DECIMAL(10, 2), nullable=False, default=0)
    total_amount = Column(DECIMAL(10, 2), nullable=False, default=0)
    
    # Shipping information
    shipping_address = Column(String(500), nullable=False)
    
    # Payment information
    payment_method = Column(String(100), nullable=False, default="credit_card")
    payment_status = Column(String(50), nullable=False, default="pending")
    
    # Additional info
    notes = Column(Text, nullable=True)
    
    # Audit fields
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
    
    # Relationships
    items = relationship(
        "OrderItemORM",
        back_populates="order",
        cascade="all, delete-orphan",
        lazy="joined"  # Always load items with order
    )
    
    # ✅ Indexes for common queries
    __table_args__ = (
        Index('idx_order_user_id', 'user_id'),
        Index('idx_order_status', 'status'),
        Index('idx_order_user_status', 'user_id', 'status'),
        Index('idx_order_created_at', 'created_at'),
    )
    
    def to_domain(self) -> DomainOrder:
        """Convert ORM model to domain entity"""
        domain_items = [item.to_domain() for item in self.items]
        
        return DomainOrder(
            id=self.id,
            user_id=self.user_id,
            status=OrderStatus(self.status),
            items=domain_items,
            subtotal=Decimal(str(self.subtotal)),
            tax_rate=Decimal(str(self.tax_rate)),
            tax_amount=Decimal(str(self.tax_amount)),
            shipping_cost=Decimal(str(self.shipping_cost)),
            total_amount=Decimal(str(self.total_amount)),
            shipping_address=self.shipping_address,
            payment_method=self.payment_method,
            payment_status=self.payment_status,
            notes=self.notes,
            created_at=self.created_at,
            updated_at=self.updated_at
        )
    
    @staticmethod
    def from_domain(order: DomainOrder) -> 'OrderORM':
        """Create ORM model from domain entity"""
        order_orm = OrderORM(
            id=order.id,
            user_id=order.user_id,
            status=order.status.value,
            subtotal=order.subtotal,
            tax_rate=order.tax_rate,
            tax_amount=order.tax_amount,
            shipping_cost=order.shipping_cost,
            total_amount=order.total_amount,
            shipping_address=order.shipping_address,
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            notes=order.notes,
            created_at=order.created_at,
            updated_at=order.updated_at
        )
        
        # Add items
        order_orm.items = [OrderItemORM.from_domain(item) for item in order.items]
        
        return order_orm


