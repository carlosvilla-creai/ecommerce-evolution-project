"""
Order Status Enum

Represents the different states an order can be in throughout its lifecycle.
"""
from enum import Enum


class OrderStatus(str, Enum):
    """
    Order status enumeration.
    
    ✅ CLEAN: Type-safe order states
    ✅ CLEAN: Clear business workflow
    """
    
    PENDING = "pending"              # Order created, awaiting payment
    CONFIRMED = "confirmed"          # Payment confirmed
    PROCESSING = "processing"        # Being prepared for shipment
    SHIPPED = "shipped"              # Shipped to customer
    DELIVERED = "delivered"          # Successfully delivered
    CANCELLED = "cancelled"          # Order cancelled
    REFUNDED = "refunded"            # Order refunded
    
    @classmethod
    def get_active_statuses(cls) -> list['OrderStatus']:
        """Get statuses that represent active orders"""
        return [cls.PENDING, cls.CONFIRMED, cls.PROCESSING, cls.SHIPPED]
    
    @classmethod
    def get_completed_statuses(cls) -> list['OrderStatus']:
        """Get statuses that represent completed orders"""
        return [cls.DELIVERED, cls.CANCELLED, cls.REFUNDED]
    
    def can_transition_to(self, new_status: 'OrderStatus') -> bool:
        """
        Check if transition to new status is valid.
        
        Business rules for order status transitions.
        """
        valid_transitions = {
            self.PENDING: [self.CONFIRMED, self.CANCELLED],
            self.CONFIRMED: [self.PROCESSING, self.CANCELLED],
            self.PROCESSING: [self.SHIPPED, self.CANCELLED],
            self.SHIPPED: [self.DELIVERED, self.CANCELLED],
            self.DELIVERED: [self.REFUNDED],
            self.CANCELLED: [],  # Terminal state
            self.REFUNDED: [],   # Terminal state
        }
        
        return new_status in valid_transitions.get(self, [])
    
    def is_terminal(self) -> bool:
        """Check if this is a terminal status (no further transitions)"""
        return self in [self.CANCELLED, self.REFUNDED]
    
    def is_active(self) -> bool:
        """Check if order is still active"""
        return self in self.get_active_statuses()


