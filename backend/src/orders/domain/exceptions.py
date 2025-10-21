"""
Domain-specific exceptions for Orders

These exceptions represent business rule violations and domain errors.
"""
from typing import Optional


class OrderDomainException(Exception):
    """Base exception for order domain errors"""
    pass


class OrderNotFoundException(OrderDomainException):
    """Raised when an order is not found"""
    
    def __init__(self, order_id: int):
        self.order_id = order_id
        super().__init__(f"Order with ID {order_id} not found")


class InvalidOrderStateException(OrderDomainException):
    """Raised when trying to perform an operation on an order in invalid state"""
    
    def __init__(self, order_id: int, current_status: str, message: str):
        self.order_id = order_id
        self.current_status = current_status
        super().__init__(f"Order {order_id} (status: {current_status}): {message}")


class InvalidOrderStatusTransitionException(OrderDomainException):
    """Raised when trying to transition to an invalid status"""
    
    def __init__(self, from_status: str, to_status: str):
        self.from_status = from_status
        self.to_status = to_status
        super().__init__(
            f"Invalid order status transition from {from_status} to {to_status}"
        )


class EmptyOrderException(OrderDomainException):
    """Raised when trying to create an order with no items"""
    
    def __init__(self):
        super().__init__("Cannot create an order with no items")


class InvalidOrderItemException(OrderDomainException):
    """Raised when order item data is invalid"""
    
    def __init__(self, message: str):
        super().__init__(message)


class InsufficientStockException(OrderDomainException):
    """Raised when product stock is insufficient for order"""
    
    def __init__(self, product_id: int, available: int, requested: int):
        self.product_id = product_id
        self.available = available
        self.requested = requested
        super().__init__(
            f"Insufficient stock for product {product_id}. "
            f"Available: {available}, Requested: {requested}"
        )


class OrderModificationNotAllowedException(OrderDomainException):
    """Raised when trying to modify an order that can't be modified"""
    
    def __init__(self, order_id: int, reason: str):
        self.order_id = order_id
        super().__init__(f"Cannot modify order {order_id}: {reason}")


class ProductNotFoundException(OrderDomainException):
    """Raised when referenced product doesn't exist"""
    
    def __init__(self, product_id: int):
        self.product_id = product_id
        super().__init__(f"Product with ID {product_id} not found")


class UserNotFoundException(OrderDomainException):
    """Raised when referenced user doesn't exist"""
    
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"User with ID {user_id} not found")


class InvalidOrderDataException(OrderDomainException):
    """Raised when order data fails validation"""
    
    def __init__(self, message: str, field: Optional[str] = None):
        self.field = field
        super().__init__(message)


class PaymentFailedException(OrderDomainException):
    """Raised when payment processing fails"""
    
    def __init__(self, order_id: int, reason: str):
        self.order_id = order_id
        super().__init__(f"Payment failed for order {order_id}: {reason}")


