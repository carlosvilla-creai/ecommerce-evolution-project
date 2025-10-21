"""
SQLAlchemy ORM Models for Products

✅ FIXED: Using SQLAlchemy ORM instead of raw SQL
✅ FIXED: Proper data types (NUMERIC for prices)
✅ FIXED: Indexes for performance
✅ FIXED: Constraints and validation
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Column, Integer, String, DECIMAL, Boolean, DateTime, Index
from sqlalchemy.sql import func

from src.shared.database import Base


class ProductORM(Base):
    """
    SQLAlchemy ORM model for Product entity.
    
    This is separate from the domain model to maintain clean architecture.
    """
    __tablename__ = "products"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # Product details
    name = Column(String(255), nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)  # ✅ DECIMAL instead of REAL
    stock = Column(Integer, nullable=False, default=0)
    category = Column(String(100), nullable=False, index=True)  # ✅ Indexed for filtering
    description = Column(String(2000), nullable=True)
    
    # Status
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    
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
    
    # ✅ Indexes for common queries
    __table_args__ = (
        Index('idx_product_category_active', 'category', 'is_active'),
        Index('idx_product_price', 'price'),
        Index('idx_product_name', 'name'),
    )
    
    def to_domain(self):
        """
        Convert ORM model to domain entity.
        
        This keeps the domain independent of SQLAlchemy.
        """
        from ...domain.models.product import Product
        
        return Product(
            id=self.id,
            name=self.name,
            price=Decimal(str(self.price)),  # Ensure Decimal precision
            stock=self.stock,
            category=self.category,
            description=self.description,
            is_active=self.is_active,
            created_at=self.created_at,
            updated_at=self.updated_at
        )
    
    @staticmethod
    def from_domain(product):
        """
        Create ORM model from domain entity.
        
        Args:
            product: Domain Product entity
            
        Returns:
            ProductORM instance
        """
        return ProductORM(
            id=product.id,
            name=product.name,
            price=product.price,
            stock=product.stock,
            category=product.category,
            description=product.description,
            is_active=product.is_active,
            created_at=product.created_at,
            updated_at=product.updated_at
        )

