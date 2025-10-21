"""
Create Order Use Case

Handles creating a new order with validation and stock checking.
"""
from decimal import Decimal
from typing import List

from ...domain.models.order import Order
from ...domain.models.order_item import OrderItem
from ...domain.interfaces.repositories import IOrderRepository
from ...domain.exceptions import (
    EmptyOrderException,
    InvalidOrderDataException,
    InsufficientStockException,
    ProductNotFoundException,
    UserNotFoundException
)
from ..dto.order_dto import (
    OrderCreateDTO,
    OrderResponseDTO,
    OrderItemResponseDTO
)

# We'll need product and user repositories for validation
from src.products.domain.interfaces.repositories import IProductRepository
from src.users.domain.interfaces.repositories import IUserRepository


class CreateOrderUseCase:
    """
    Use case for creating a new order.
    
    ✅ CLEAN: Validates user exists
    ✅ CLEAN: Validates products exist and have sufficient stock
    ✅ CLEAN: Calculates totals automatically
    ✅ CLEAN: Creates order with items in single transaction
    """
    
    def __init__(
        self,
        order_repository: IOrderRepository,
        product_repository: IProductRepository,
        user_repository: IUserRepository
    ):
        """
        Initialize use case with repository dependencies.
        
        Args:
            order_repository: Repository for order data access
            product_repository: Repository for product validation
            user_repository: Repository for user validation
        """
        self.order_repository = order_repository
        self.product_repository = product_repository
        self.user_repository = user_repository
    
    async def execute(self, user_id: int, order_data: OrderCreateDTO) -> OrderResponseDTO:
        """
        Execute the create order use case.
        
        Args:
            user_id: ID of the user creating the order
            order_data: DTO with order creation data
            
        Returns:
            OrderResponseDTO with created order data
            
        Raises:
            UserNotFoundException: If user doesn't exist
            ProductNotFoundException: If any product doesn't exist
            InsufficientStockException: If product stock is insufficient
            EmptyOrderException: If order has no items
            InvalidOrderDataException: If order data is invalid
        """
        # Validate user exists
        user = await self.user_repository.get_by_id(user_id)
        if not user:
            raise UserNotFoundException(user_id)
        
        # Validate order has items
        if not order_data.items:
            raise EmptyOrderException()
        
        # Create order items with product validation
        order_items: List[OrderItem] = []
        
        for item_dto in order_data.items:
            # Get product to validate existence and stock
            product = await self.product_repository.get_by_id(item_dto.product_id)
            
            if not product:
                raise ProductNotFoundException(item_dto.product_id)
            
            # Check stock availability
            if not product.can_fulfill_quantity(item_dto.quantity):
                raise InsufficientStockException(
                    product_id=product.id,
                    available=product.stock,
                    requested=item_dto.quantity
                )
            
            # Create order item
            order_item = OrderItem(
                product_id=product.id,
                product_name=product.name,
                quantity=item_dto.quantity,
                unit_price=product.price
            )
            
            order_items.append(order_item)
        
        # Create order domain entity
        try:
            order = Order(
                user_id=user_id,
                items=order_items,
                shipping_address=order_data.shipping_address,
                payment_method=order_data.payment_method,
                notes=order_data.notes
            )
            
            # Calculate all amounts
            order.recalculate_amounts()
            
            # Save order
            created_order = await self.order_repository.create(order)
            
            # Reduce product stock (TODO: This should be in a transaction)
            for item_dto in order_data.items:
                product = await self.product_repository.get_by_id(item_dto.product_id)
                product.reduce_stock(item_dto.quantity)
                await self.product_repository.update(product)
            
            # Convert to response DTO
            return self._to_response_dto(created_order)
            
        except ValueError as e:
            raise InvalidOrderDataException(str(e))
    
    def _to_response_dto(self, order: Order) -> OrderResponseDTO:
        """Convert domain Order to response DTO"""
        item_dtos = [
            OrderItemResponseDTO(
                id=item.id,
                product_id=item.product_id,
                product_name=item.product_name,
                quantity=item.quantity,
                unit_price=item.unit_price,
                subtotal=item.get_subtotal()
            )
            for item in order.items
        ]
        
        return OrderResponseDTO(
            id=order.id,
            user_id=order.user_id,
            status=order.status.value,
            items=item_dtos,
            subtotal=order.subtotal,
            tax_rate=order.tax_rate,
            tax_amount=order.tax_amount,
            shipping_cost=order.shipping_cost,
            total_amount=order.total_amount,
            shipping_address=order.shipping_address,
            payment_method=order.payment_method,
            payment_status=order.payment_status,
            notes=order.notes,
            created_at=order.created_at,
            updated_at=order.updated_at
        )


