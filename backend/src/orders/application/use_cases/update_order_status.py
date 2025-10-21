"""
Update Order Status Use Case

Handles updating an order's status with validation.
"""
from ...domain.interfaces.repositories import IOrderRepository
from ...domain.models.order_status import OrderStatus
from ...domain.exceptions import (
    OrderNotFoundException,
    InvalidOrderStatusTransitionException
)
from ..dto.order_dto import OrderStatusUpdateDTO, OrderResponseDTO, OrderItemResponseDTO


class UpdateOrderStatusUseCase:
    """
    Use case for updating order status.
    
    ✅ CLEAN: Validates status transitions
    ✅ CLEAN: Business rules enforced
    """
    
    def __init__(self, order_repository: IOrderRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            order_repository: Repository for order data access
        """
        self.order_repository = order_repository
    
    async def execute(
        self,
        order_id: int,
        status_update: OrderStatusUpdateDTO
    ) -> OrderResponseDTO:
        """
        Execute the update order status use case.
        
        Args:
            order_id: ID of the order to update
            status_update: DTO with new status
            
        Returns:
            OrderResponseDTO with updated order data
            
        Raises:
            OrderNotFoundException: If order not found
            InvalidOrderStatusTransitionException: If status transition is invalid
        """
        # Get existing order
        order = await self.order_repository.get_by_id(order_id)
        
        if not order:
            raise OrderNotFoundException(order_id)
        
        # Validate status transition
        new_status = OrderStatus(status_update.status)
        
        if not order.status.can_transition_to(new_status):
            raise InvalidOrderStatusTransitionException(
                from_status=order.status.value,
                to_status=new_status.value
            )
        
        # Update status
        order.update_status(new_status)
        
        # Save updated order
        updated_order = await self.order_repository.update(order)
        
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
            for item in updated_order.items
        ]
        
        return OrderResponseDTO(
            id=updated_order.id,
            user_id=updated_order.user_id,
            status=updated_order.status.value,
            items=item_dtos,
            subtotal=updated_order.subtotal,
            tax_rate=updated_order.tax_rate,
            tax_amount=updated_order.tax_amount,
            shipping_cost=updated_order.shipping_cost,
            total_amount=updated_order.total_amount,
            shipping_address=updated_order.shipping_address,
            payment_method=updated_order.payment_method,
            payment_status=updated_order.payment_status,
            notes=updated_order.notes,
            created_at=updated_order.created_at,
            updated_at=updated_order.updated_at
        )


