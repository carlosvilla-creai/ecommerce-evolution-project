"""
Product Domain Model

This is a pure domain entity with business logic and validation.
It's independent of database implementation details.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, validator


class Product(BaseModel):
    """
    Product domain entity with business rules and validation.
    
    ✅ FIXED: Using Decimal for prices (no float precision issues)
    ✅ FIXED: Proper validation with business rules
    ✅ FIXED: Value objects pattern for complex types
    """
    
    id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=255)
    price: Decimal = Field(..., gt=0)  # ✅ Decimal instead of float
    stock: int = Field(..., ge=0)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    is_active: bool = Field(default=True)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            Decimal: str,  # Serialize Decimal as string to avoid precision loss
            datetime: lambda v: v.isoformat() if v else None
        }
        
        json_schema_extra = {
            "example": {
                "name": "Premium Wireless Headphones",
                "price": "149.99",
                "stock": 50,
                "category": "Electronics",
                "description": "High-quality wireless headphones with noise cancellation"
            }
        }
    
    @validator('name')
    def validate_name(cls, v: str) -> str:
        """Validate and normalize product name"""
        v = v.strip()
        if not v:
            raise ValueError('Product name cannot be empty or whitespace')
        return v
    
    @validator('category')
    def validate_category(cls, v: str) -> str:
        """Validate and normalize category"""
        v = v.strip()
        if not v:
            raise ValueError('Category cannot be empty or whitespace')
        return v
    
    @validator('description')
    def validate_description(cls, v: Optional[str]) -> Optional[str]:
        """Clean up description"""
        if v:
            v = v.strip()
            return v if v else None
        return None
    
    # Business logic methods
    
    def is_in_stock(self) -> bool:
        """Check if product is available in stock"""
        return self.stock > 0 and self.is_active
    
    def can_fulfill_quantity(self, quantity: int) -> bool:
        """Check if we can fulfill the requested quantity"""
        return self.is_active and self.stock >= quantity > 0
    
    def reduce_stock(self, quantity: int) -> None:
        """
        Reduce stock by quantity.
        
        Raises:
            ValueError: If insufficient stock
        """
        if not self.can_fulfill_quantity(quantity):
            raise ValueError(
                f"Insufficient stock. Available: {self.stock}, Requested: {quantity}"
            )
        self.stock -= quantity
    
    def increase_stock(self, quantity: int) -> None:
        """Increase stock by quantity"""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        self.stock += quantity
    
    def deactivate(self) -> None:
        """Deactivate the product (soft delete)"""
        self.is_active = False
    
    def activate(self) -> None:
        """Activate the product"""
        self.is_active = True
    
    def update_price(self, new_price: Decimal) -> None:
        """
        Update product price with validation.
        
        Raises:
            ValueError: If price is not positive
        """
        if new_price <= 0:
            raise ValueError("Price must be greater than 0")
        self.price = new_price

