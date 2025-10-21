"""
Data Transfer Objects for Order use cases

DTOs transfer data between layers without exposing domain entities.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, validator

from ...domain.models.order_status import OrderStatus


class OrderItemCreateDTO(BaseModel):
    """DTO for creating an order item"""
    product_id: int = Field(..., gt=0, description="Product ID")
    quantity: int = Field(..., gt=0, le=1000, description="Quantity to order")
    
    class Config:
        json_schema_extra = {
            "example": {
                "product_id": 1,
                "quantity": 2
            }
        }


class OrderItemResponseDTO(BaseModel):
    """DTO for order item response"""
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    
    class Config:
        json_encoders = {
            Decimal: str
        }
        
        json_schema_extra = {
            "example": {
                "id": 1,
                "product_id": 1,
                "product_name": "Wireless Mouse",
                "quantity": 2,
                "unit_price": "29.99",
                "subtotal": "59.98"
            }
        }


class OrderCreateDTO(BaseModel):
    """DTO for creating a new order"""
    items: List[OrderItemCreateDTO] = Field(..., min_items=1, description="Order items")
    shipping_address: str = Field(..., min_length=10, max_length=500, description="Shipping address")
    payment_method: str = Field(default="credit_card", description="Payment method")
    notes: Optional[str] = Field(None, max_length=1000, description="Order notes")
    
    @validator('items')
    def validate_items(cls, v: List[OrderItemCreateDTO]) -> List[OrderItemCreateDTO]:
        """Validate that order has items"""
        if not v:
            raise ValueError('Order must contain at least one item')
        return v
    
    @validator('shipping_address')
    def strip_whitespace(cls, v: str) -> str:
        """Remove leading/trailing whitespace"""
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {"product_id": 1, "quantity": 2},
                    {"product_id": 3, "quantity": 1}
                ],
                "shipping_address": "123 Main St, Apt 4B, New York, NY 10001",
                "payment_method": "credit_card",
                "notes": "Please ring doorbell"
            }
        }


class OrderUpdateDTO(BaseModel):
    """DTO for updating an order"""
    shipping_address: Optional[str] = Field(None, min_length=10, max_length=500)
    notes: Optional[str] = Field(None, max_length=1000)
    
    @validator('shipping_address')
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """Remove leading/trailing whitespace"""
        return v.strip() if v else None
    
    class Config:
        json_schema_extra = {
            "example": {
                "shipping_address": "456 Oak Ave, Boston, MA 02101",
                "notes": "Updated delivery instructions"
            }
        }


class OrderStatusUpdateDTO(BaseModel):
    """DTO for updating order status"""
    status: OrderStatus = Field(..., description="New order status")
    
    class Config:
        use_enum_values = True
        
        json_schema_extra = {
            "example": {
                "status": "confirmed"
            }
        }


class OrderResponseDTO(BaseModel):
    """DTO for order response"""
    id: int
    user_id: int
    status: str
    items: List[OrderItemResponseDTO]
    subtotal: Decimal
    tax_rate: Decimal
    tax_amount: Decimal
    shipping_cost: Decimal
    total_amount: Decimal
    shipping_address: str
    payment_method: str
    payment_status: str
    notes: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat() if v else None
        }
        
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "status": "pending",
                "items": [
                    {
                        "id": 1,
                        "product_id": 1,
                        "product_name": "Wireless Mouse",
                        "quantity": 2,
                        "unit_price": "29.99",
                        "subtotal": "59.98"
                    }
                ],
                "subtotal": "59.98",
                "tax_rate": "0.10",
                "tax_amount": "5.998",
                "shipping_cost": "10.00",
                "total_amount": "75.978",
                "shipping_address": "123 Main St, Apt 4B, New York, NY 10001",
                "payment_method": "credit_card",
                "payment_status": "pending",
                "notes": "Please ring doorbell",
                "created_at": "2024-01-15T10:30:00",
                "updated_at": "2024-01-15T10:30:00"
            }
        }


class OrderListResponseDTO(BaseModel):
    """DTO for paginated list of orders"""
    orders: List[OrderResponseDTO]
    total: int
    skip: int
    limit: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "orders": [],
                "total": 10,
                "skip": 0,
                "limit": 20
            }
        }


