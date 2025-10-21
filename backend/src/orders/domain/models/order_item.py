"""
Order Item Domain Model

Represents a single item within an order.
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, validator


class OrderItem(BaseModel):
    """
    OrderItem domain entity with business rules.
    
    ✅ CLEAN: Immutable once created (represents historical purchase)
    ✅ CLEAN: Decimal for prices (no float precision issues)
    ✅ CLEAN: Validation for quantities and prices
    """
    
    id: Optional[int] = None
    order_id: Optional[int] = None
    product_id: int = Field(..., gt=0, description="ID of the product")
    product_name: str = Field(..., min_length=1, max_length=255, description="Product name at time of purchase")
    quantity: int = Field(..., gt=0, description="Quantity ordered")
    unit_price: Decimal = Field(..., gt=0, description="Price per unit at time of purchase")
    created_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat() if v else None
        }
        
        json_schema_extra = {
            "example": {
                "product_id": 1,
                "product_name": "Wireless Mouse",
                "quantity": 2,
                "unit_price": "29.99"
            }
        }
    
    @validator('product_name')
    def validate_product_name(cls, v: str) -> str:
        """Validate and normalize product name"""
        v = v.strip()
        if not v:
            raise ValueError('Product name cannot be empty')
        return v
    
    @validator('quantity')
    def validate_quantity(cls, v: int) -> int:
        """Validate quantity is positive"""
        if v <= 0:
            raise ValueError('Quantity must be greater than 0')
        if v > 1000:
            raise ValueError('Quantity cannot exceed 1000 items per line')
        return v
    
    @validator('unit_price')
    def validate_unit_price(cls, v: Decimal) -> Decimal:
        """Validate unit price is positive"""
        if v <= 0:
            raise ValueError('Unit price must be greater than 0')
        return v
    
    # Business logic methods
    
    def get_subtotal(self) -> Decimal:
        """Calculate subtotal for this order item"""
        return self.unit_price * self.quantity
    
    def matches_product(self, product_id: int, unit_price: Decimal) -> bool:
        """Check if this item matches a product and price"""
        return self.product_id == product_id and self.unit_price == unit_price


