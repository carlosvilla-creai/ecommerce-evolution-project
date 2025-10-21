"""
Domain-specific exceptions for Products

These exceptions represent business rule violations and domain errors.
They're independent of HTTP or infrastructure concerns.
"""
from typing import Optional


class ProductDomainException(Exception):
    """Base exception for product domain errors"""
    pass


class ProductNotFoundException(ProductDomainException):
    """Raised when a product is not found"""
    
    def __init__(self, product_id: int):
        self.product_id = product_id
        super().__init__(f"Product with ID {product_id} not found")


class ProductAlreadyExistsException(ProductDomainException):
    """Raised when trying to create a product that already exists"""
    
    def __init__(self, product_name: str):
        self.product_name = product_name
        super().__init__(f"Product '{product_name}' already exists")


class InsufficientStockException(ProductDomainException):
    """Raised when trying to reduce stock beyond available quantity"""
    
    def __init__(self, product_id: int, available: int, requested: int):
        self.product_id = product_id
        self.available = available
        self.requested = requested
        super().__init__(
            f"Insufficient stock for product {product_id}. "
            f"Available: {available}, Requested: {requested}"
        )


class InvalidProductDataException(ProductDomainException):
    """Raised when product data fails validation"""
    
    def __init__(self, message: str, field: Optional[str] = None):
        self.field = field
        super().__init__(message)


class ProductInactiveException(ProductDomainException):
    """Raised when trying to perform operations on inactive product"""
    
    def __init__(self, product_id: int):
        self.product_id = product_id
        super().__init__(f"Product {product_id} is inactive")

