"""
SQLAlchemy implementation of IProductRepository

✅ FIXED: Using SQLAlchemy ORM (no SQL injection)
✅ FIXED: Proper async/await support
✅ FIXED: Transaction management
✅ FIXED: Error handling
"""
from typing import List, Optional
from decimal import Decimal
from datetime import datetime
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from ....domain.models.product import Product
from ....domain.interfaces.repositories import IProductRepository
from ..models import ProductORM


class ProductRepository(IProductRepository):
    """
    SQLAlchemy implementation of the Product repository.
    
    ✅ No SQL injection vulnerabilities
    ✅ Proper query parameter binding
    ✅ Transaction support
    ✅ Async operations
    """
    
    def __init__(self, session: AsyncSession):
        """
        Initialize repository with database session.
        
        Args:
            session: SQLAlchemy async session
        """
        self.session = session
    
    async def create(self, product: Product) -> Product:
        """Create a new product"""
        # Convert domain entity to ORM model
        product_orm = ProductORM.from_domain(product)
        
        # Add to session
        self.session.add(product_orm)
        await self.session.flush()  # Get the ID without committing
        
        # Convert back to domain entity
        return product_orm.to_domain()
    
    async def get_by_id(self, product_id: int) -> Optional[Product]:
        """Get product by ID"""
        # ✅ Using SQLAlchemy query builder - no SQL injection
        stmt = select(ProductORM).where(ProductORM.id == product_id)
        result = await self.session.execute(stmt)
        product_orm = result.scalar_one_or_none()
        
        return product_orm.to_domain() if product_orm else None
    
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
        """Get all products with filtering"""
        # Build query using SQLAlchemy - ✅ NO SQL INJECTION
        stmt = select(ProductORM)
        
        # Apply filters
        conditions = []
        
        if active_only:
            conditions.append(ProductORM.is_active == True)
        
        if category:
            # ✅ Parameter binding - safe from SQL injection
            conditions.append(ProductORM.category == category)
        
        if min_price is not None:
            conditions.append(ProductORM.price >= min_price)
        
        if max_price is not None:
            conditions.append(ProductORM.price <= max_price)
        
        if search:
            # ✅ Safe LIKE query with parameter binding
            search_pattern = f"%{search}%"
            conditions.append(
                or_(
                    ProductORM.name.ilike(search_pattern),
                    ProductORM.description.ilike(search_pattern)
                )
            )
        
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        # Apply pagination
        stmt = stmt.offset(skip).limit(limit)
        
        # Execute query
        result = await self.session.execute(stmt)
        products_orm = result.scalars().all()
        
        # Convert to domain entities
        return [p.to_domain() for p in products_orm]
    
    async def update(self, product: Product) -> Product:
        """Update an existing product"""
        if not product.id:
            raise ValueError("Product ID is required for update")
        
        # Get existing product
        stmt = select(ProductORM).where(ProductORM.id == product.id)
        result = await self.session.execute(stmt)
        product_orm = result.scalar_one_or_none()
        
        if not product_orm:
            raise ValueError(f"Product with ID {product.id} not found")
        
        # Update fields
        product_orm.name = product.name
        product_orm.price = product.price
        product_orm.stock = product.stock
        product_orm.category = product.category
        product_orm.description = product.description
        product_orm.is_active = product.is_active
        product_orm.updated_at = datetime.utcnow()
        
        await self.session.flush()
        
        return product_orm.to_domain()
    
    async def delete(self, product_id: int) -> bool:
        """Hard delete a product"""
        stmt = select(ProductORM).where(ProductORM.id == product_id)
        result = await self.session.execute(stmt)
        product_orm = result.scalar_one_or_none()
        
        if not product_orm:
            return False
        
        await self.session.delete(product_orm)
        await self.session.flush()
        
        return True
    
    async def exists(self, product_id: int) -> bool:
        """Check if product exists"""
        stmt = select(func.count()).select_from(ProductORM).where(
            ProductORM.id == product_id
        )
        result = await self.session.execute(stmt)
        count = result.scalar()
        
        return count > 0
    
    async def count(
        self,
        category: Optional[str] = None,
        active_only: bool = True
    ) -> int:
        """Count products with filtering"""
        stmt = select(func.count()).select_from(ProductORM)
        
        conditions = []
        
        if active_only:
            conditions.append(ProductORM.is_active == True)
        
        if category:
            conditions.append(ProductORM.category == category)
        
        if conditions:
            stmt = stmt.where(and_(*conditions))
        
        result = await self.session.execute(stmt)
        return result.scalar()

