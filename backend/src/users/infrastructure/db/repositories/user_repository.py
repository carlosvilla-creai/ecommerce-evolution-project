"""
SQLAlchemy implementation of IUserRepository

✅ CLEAN: No SQL injection vulnerabilities
✅ CLEAN: Async/await support
✅ CLEAN: Transaction management
"""
from typing import Optional
from datetime import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from ....domain.models.user import User
from ....domain.interfaces.repositories import IUserRepository
from ..models import UserORM


class UserRepository(IUserRepository):
    """
    SQLAlchemy implementation of the User repository.
    
    ✅ No SQL injection vulnerabilities
    ✅ Proper parameter binding
    ✅ Transaction support
    """
    
    def __init__(self, session: AsyncSession):
        """
        Initialize repository with database session.
        
        Args:
            session: SQLAlchemy async session
        """
        self.session = session
    
    async def create(self, user: User) -> User:
        """Create a new user"""
        user_orm = UserORM.from_domain(user)
        
        self.session.add(user_orm)
        await self.session.flush()
        
        return user_orm.to_domain()
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        stmt = select(UserORM).where(UserORM.id == user_id)
        result = await self.session.execute(stmt)
        user_orm = result.scalar_one_or_none()
        
        return user_orm.to_domain() if user_orm else None
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        stmt = select(UserORM).where(UserORM.email == email)
        result = await self.session.execute(stmt)
        user_orm = result.scalar_one_or_none()
        
        return user_orm.to_domain() if user_orm else None
    
    async def update(self, user: User) -> User:
        """Update an existing user"""
        if not user.id:
            raise ValueError("User ID is required for update")
        
        stmt = select(UserORM).where(UserORM.id == user.id)
        result = await self.session.execute(stmt)
        user_orm = result.scalar_one_or_none()
        
        if not user_orm:
            raise ValueError(f"User with ID {user.id} not found")
        
        # Update fields
        user_orm.email = user.email
        user_orm.hashed_password = user.hashed_password
        user_orm.first_name = user.first_name
        user_orm.last_name = user.last_name
        user_orm.is_active = user.is_active
        user_orm.is_superuser = user.is_superuser
        user_orm.role = user.role
        user_orm.updated_at = datetime.utcnow()
        
        await self.session.flush()
        
        return user_orm.to_domain()
    
    async def delete(self, user_id: int) -> bool:
        """Hard delete a user"""
        stmt = select(UserORM).where(UserORM.id == user_id)
        result = await self.session.execute(stmt)
        user_orm = result.scalar_one_or_none()
        
        if not user_orm:
            return False
        
        await self.session.delete(user_orm)
        await self.session.flush()
        
        return True
    
    async def exists_by_email(self, email: str) -> bool:
        """Check if user exists by email"""
        stmt = select(func.count()).select_from(UserORM).where(
            UserORM.email == email
        )
        result = await self.session.execute(stmt)
        count = result.scalar()
        
        return count > 0

