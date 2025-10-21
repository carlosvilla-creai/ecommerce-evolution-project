"""
User Domain Model

This is a pure domain entity with business logic and validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, EmailStr, validator
import re


class User(BaseModel):
    """
    User domain entity with business rules and validation.
    
    ✅ CLEAN: Email validation with EmailStr
    ✅ CLEAN: Password hashing handled separately (not stored in plain text)
    ✅ CLEAN: Role-based access control support
    """
    
    id: Optional[int] = None
    email: EmailStr = Field(..., description="User email address")
    hashed_password: str = Field(..., description="Bcrypt hashed password")
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    role: str = Field(default="customer", description="User role: customer, admin")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }
        
        json_schema_extra = {
            "example": {
                "email": "john.doe@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "customer"
            }
        }
    
    @validator('first_name', 'last_name')
    def validate_name(cls, v: str) -> str:
        """Validate and normalize names"""
        v = v.strip()
        if not v:
            raise ValueError('Name cannot be empty or whitespace')
        if len(v) < 2:
            raise ValueError('Name must be at least 2 characters')
        return v
    
    @validator('role')
    def validate_role(cls, v: str) -> str:
        """Validate user role"""
        allowed_roles = ['customer', 'admin']
        if v not in allowed_roles:
            raise ValueError(f'Role must be one of: {", ".join(allowed_roles)}')
        return v
    
    # Business logic methods
    
    def get_full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"
    
    def is_admin(self) -> bool:
        """Check if user has admin privileges"""
        return self.role == 'admin' or self.is_superuser
    
    def can_access_admin_panel(self) -> bool:
        """Check if user can access admin panel"""
        return self.is_active and self.is_admin()
    
    def deactivate(self) -> None:
        """Deactivate user account (soft delete)"""
        self.is_active = False
    
    def activate(self) -> None:
        """Activate user account"""
        self.is_active = True
    
    def promote_to_admin(self) -> None:
        """Promote user to admin role"""
        self.role = 'admin'
    
    def demote_to_customer(self) -> None:
        """Demote user to customer role"""
        self.role = 'customer'

