"""
Order Domain Model

Represents a customer order with items and business logic.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, validator

from .order_status import OrderStatus
from .order_item import OrderItem


class Order(BaseModel):
    """
    Order domain entity with business rules and calculations.
    
    ✅ CLEAN: Aggregate root containing OrderItems
    ✅ CLEAN: Business logic for total calculations
    ✅ CLEAN: Status transition validation
    """
    
    id: Optional[int] = None
    user_id: int = Field(..., gt=0, description="ID of the user who placed the order")
    status: OrderStatus = Field(default=OrderStatus.PENDING, description="Current order status")
    items: List[OrderItem] = Field(default_factory=list, description="Order items")
    
    # Financial details
    subtotal: Decimal = Field(default=Decimal("0"), ge=0, description="Sum of all items")
    tax_rate: Decimal = Field(default=Decimal("0.10"), ge=0, le=1, description="Tax rate (default 10%)")
    tax_amount: Decimal = Field(default=Decimal("0"), ge=0, description="Calculated tax amount")
    shipping_cost: Decimal = Field(default=Decimal("0"), ge=0, description="Shipping cost")
    total_amount: Decimal = Field(default=Decimal("0"), ge=0, description="Final total")
    
    # Shipping information
    shipping_address: str = Field(..., min_length=10, max_length=500, description="Shipping address")
    
    # Payment information
    payment_method: str = Field(default="credit_card", description="Payment method")
    payment_status: str = Field(default="pending", description="Payment status")
    
    # Metadata
    notes: Optional[str] = Field(None, max_length=1000, description="Order notes")
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        """Pydantic configuration"""
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat() if v else None
        }
        use_enum_values = True
        
        json_schema_extra = {
            "example": {
                "user_id": 1,
                "items": [
                    {
                        "product_id": 1,
                        "product_name": "Wireless Mouse",
                        "quantity": 2,
                        "unit_price": "29.99"
                    }
                ],
                "shipping_address": "123 Main St, Apt 4B, New York, NY 10001",
                "payment_method": "credit_card"
            }
        }
    
    @validator('items')
    def validate_items(cls, v: List[OrderItem]) -> List[OrderItem]:
        """Validate that order has at least one item"""
        if not v:
            raise ValueError('Order must contain at least one item')
        return v
    
    @validator('shipping_address')
    def validate_shipping_address(cls, v: str) -> str:
        """Validate and normalize shipping address"""
        v = v.strip()
        if len(v) < 10:
            raise ValueError('Shipping address must be at least 10 characters')
        return v
    
    # Business logic methods
    
    def add_item(self, item: OrderItem) -> None:
        """
        Add an item to the order.
        
        Raises:
            ValueError: If order is not in a state that allows modifications
        """
        if self.status != OrderStatus.PENDING:
            raise ValueError(f"Cannot add items to order with status: {self.status}")
        
        # Check if item with same product already exists
        for existing_item in self.items:
            if existing_item.product_id == item.product_id and existing_item.unit_price == item.unit_price:
                # Increase quantity instead of adding duplicate
                existing_item.quantity += item.quantity
                return
        
        self.items.append(item)
    
    def remove_item(self, item_id: int) -> bool:
        """
        Remove an item from the order.
        
        Returns:
            True if item was removed, False if not found
        """
        if self.status != OrderStatus.PENDING:
            raise ValueError(f"Cannot remove items from order with status: {self.status}")
        
        initial_count = len(self.items)
        self.items = [item for item in self.items if item.id != item_id]
        return len(self.items) < initial_count
    
    def calculate_subtotal(self) -> Decimal:
        """Calculate subtotal from all items"""
        return sum((item.get_subtotal() for item in self.items), Decimal("0"))
    
    def calculate_tax(self) -> Decimal:
        """Calculate tax amount based on subtotal"""
        return self.subtotal * self.tax_rate
    
    def calculate_total(self) -> Decimal:
        """Calculate final total amount"""
        return self.subtotal + self.tax_amount + self.shipping_cost
    
    def recalculate_amounts(self) -> None:
        """Recalculate all financial amounts"""
        self.subtotal = self.calculate_subtotal()
        self.tax_amount = self.calculate_tax()
        self.total_amount = self.calculate_total()
    
    def update_status(self, new_status: OrderStatus) -> None:
        """
        Update order status with validation.
        
        Args:
            new_status: New status to transition to
            
        Raises:
            ValueError: If transition is not valid
        """
        if not self.status.can_transition_to(new_status):
            raise ValueError(
                f"Invalid status transition from {self.status} to {new_status}"
            )
        self.status = new_status
    
    def can_be_cancelled(self) -> bool:
        """Check if order can be cancelled"""
        return self.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING]
    
    def cancel(self) -> None:
        """Cancel the order"""
        if not self.can_be_cancelled():
            raise ValueError(f"Cannot cancel order with status: {self.status}")
        self.status = OrderStatus.CANCELLED
    
    def confirm_payment(self) -> None:
        """Confirm payment and update status"""
        if self.status != OrderStatus.PENDING:
            raise ValueError(f"Can only confirm payment for pending orders")
        self.payment_status = "completed"
        self.status = OrderStatus.CONFIRMED
    
    def get_item_count(self) -> int:
        """Get total number of items in order"""
        return sum(item.quantity for item in self.items)
    
    def is_editable(self) -> bool:
        """Check if order can still be edited"""
        return self.status == OrderStatus.PENDING


