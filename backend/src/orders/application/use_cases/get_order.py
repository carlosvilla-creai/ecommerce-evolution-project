"""
Get Order By ID Use Case

Retrieves a single order by its ID.
"""
from ...domain.interfaces.repositories import IOrderRepository
from ...domain.exceptions import OrderNotFoundException
from ..dto.order_dto import OrderResponseDTO, OrderItemResponseDTO


class GetOrderByIdUseCase:
    """Use case for retrieving an order by ID"""
    
    def __init__(self, order_repository: IOrderRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            order_repository: Repository for order data access
        """
        self.order_repository = order_repository
    
    async def execute(self, order_id: int, user_id: int = None) -> OrderResponseDTO:
        """
        Execute the get order by ID use case.
        
        Args:
            order_id: ID of the order to retrieve
            user_id: Optional user ID for authorization check
            
        Returns:
            OrderResponseDTO with order data
            
        Raises:
            OrderNotFoundException: If order not found or doesn't belong to user
        """
        order = await self.order_repository.get_by_id(order_id)
        
        if not order:
            raise OrderNotFoundException(order_id)
        
        # Optional: Check if order belongs to user
        if user_id is not None and order.user_id != user_id:
            raise OrderNotFoundException(order_id)  # Don't reveal order exists
        
        # Convert to response DTO
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


