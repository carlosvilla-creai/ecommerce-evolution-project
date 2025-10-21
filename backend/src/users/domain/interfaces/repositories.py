"""
User Repository Interface

This defines the contract for user data access without specifying implementation.
"""
from abc import ABC, abstractmethod
from typing import Optional
from ..models.user import User


class IUserRepository(ABC):
    """
    Abstract repository interface for User domain entity.
    
    Infrastructure layer will implement this using SQLAlchemy.
    """
    
    @abstractmethod
    async def create(self, user: User) -> User:
        """
        Create a new user.
        
        Args:
            user: User entity to create
            
        Returns:
            Created user with ID assigned
        """
        pass
    
    @abstractmethod
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """
        Get user by ID.
        
        Args:
            user_id: User ID
            
        Returns:
            User if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def get_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email address.
        
        Args:
            email: User email
            
        Returns:
            User if found, None otherwise
        """
        pass
    
    @abstractmethod
    async def update(self, user: User) -> User:
        """
        Update an existing user.
        
        Args:
            user: User entity with updated data
            
        Returns:
            Updated user
        """
        pass
    
    @abstractmethod
    async def delete(self, user_id: int) -> bool:
        """
        Delete a user (hard delete).
        
        Args:
            user_id: User ID to delete
            
        Returns:
            True if deleted, False if not found
        """
        pass
    
    @abstractmethod
    async def exists_by_email(self, email: str) -> bool:
        """
        Check if user exists by email.
        
        Args:
            email: Email to check
            
        Returns:
            True if exists, False otherwise
        """
        pass

