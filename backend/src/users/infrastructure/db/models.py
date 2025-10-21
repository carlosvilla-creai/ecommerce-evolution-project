"""
SQLAlchemy ORM Models for Users

✅ CLEAN: Using SQLAlchemy ORM
✅ CLEAN: Proper data types and constraints
✅ CLEAN: Indexes for performance
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from src.shared.database import Base


class UserORM(Base):
    """
    SQLAlchemy ORM model for User entity.
    
    Separate from domain model to maintain clean architecture.
    """
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    # User details
    email = Column(String(255), unique=True, nullable=False, index=True)  # ✅ Indexed for lookups
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    
    # Status and permissions
    is_active = Column(Boolean, nullable=False, default=True, index=True)
    is_superuser = Column(Boolean, nullable=False, default=False)
    role = Column(String(50), nullable=False, default="customer", index=True)
    
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
    
    def to_domain(self):
        """Convert ORM model to domain entity"""
        from ...domain.models.user import User
        
        return User(
            id=self.id,
            email=self.email,
            hashed_password=self.hashed_password,
            first_name=self.first_name,
            last_name=self.last_name,
            is_active=self.is_active,
            is_superuser=self.is_superuser,
            role=self.role,
            created_at=self.created_at,
            updated_at=self.updated_at
        )
    
    @staticmethod
    def from_domain(user):
        """Create ORM model from domain entity"""
        return UserORM(
            id=user.id,
            email=user.email,
            hashed_password=user.hashed_password,
            first_name=user.first_name,
            last_name=user.last_name,
            is_active=user.is_active,
            is_superuser=user.is_superuser,
            role=user.role,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

