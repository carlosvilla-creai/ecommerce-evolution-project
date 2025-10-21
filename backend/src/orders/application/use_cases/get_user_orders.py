"""
Get User Orders Use Case

Retrieves all orders for a specific user.
"""
from typing import Optional

from ...domain.interfaces.repositories import IOrderRepository
from ...domain.models.order_status import OrderStatus
from ..dto.order_dto import OrderListResponseDTO, OrderResponseDTO, OrderItemResponseDTO


class GetUserOrdersUseCase:
    """Use case for retrieving all orders for a user"""
    
    def __init__(self, order_repository: IOrderRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            order_repository: Repository for order data access
        """
        self.order_repository = order_repository
    
    async def execute(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
        status: Optional[OrderStatus] = None
    ) -> OrderListResponseDTO:
        """
        Execute the get user orders use case.
        
        Args:
            user_id: User ID
            skip: Number of records to skip
            limit: Maximum number of records
            status: Filter by status (optional)
            
        Returns:
            OrderListResponseDTO with paginated orders
        """
        # Get orders from repository
        orders = await self.order_repository.get_by_user_id(
            user_id=user_id,
            skip=skip,
            limit=limit,
            status=status
        )
        
        # Get total count
        total = await self.order_repository.count_by_user(
            user_id=user_id,
            status=status
        )
        
        # Convert to response DTOs
        order_responses = [
            self._to_response_dto(order)
            for order in orders
        ]
        
        return OrderListResponseDTO(
            orders=order_responses,
            total=total,
            skip=skip,
            limit=limit
        )
    
    def _to_response_dto(self, order) -> OrderResponseDTO:
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


