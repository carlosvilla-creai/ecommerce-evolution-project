"""
Clean API Endpoints for Orders

✅ CLEAN: Proper separation of concerns
✅ CLEAN: No business logic in controllers
✅ CLEAN: Dependency injection
✅ CLEAN: Proper error handling
✅ CLEAN: Authentication required
"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional

from ...application.use_cases import (
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetUserOrdersUseCase,
    UpdateOrderStatusUseCase
)
from ...application.dto.order_dto import (
    OrderCreateDTO,
    OrderResponseDTO,
    OrderListResponseDTO,
    OrderStatusUpdateDTO
)
from ...domain.exceptions import (
    OrderNotFoundException,
    InvalidOrderStatusTransitionException,
    EmptyOrderException,
    InvalidOrderDataException,
    InsufficientStockException,
    ProductNotFoundException
)
from ...domain.models.order_status import OrderStatus
from ..dependencies import (
    get_create_order_use_case,
    get_get_order_use_case,
    get_get_user_orders_use_case,
    get_update_order_status_use_case
)
from src.users.infrastructure.auth.jwt_handler import get_current_active_user
from src.users.domain.models.user import User


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post(
    "/",
    response_model=OrderResponseDTO,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new order",
    description="Create a new order from cart items (requires authentication)"
)
async def create_order(
    order_data: OrderCreateDTO,
    current_user: User = Depends(get_current_active_user),
    use_case: CreateOrderUseCase = Depends(get_create_order_use_case)
) -> OrderResponseDTO:
    """
    Create a new order.
    
    ✅ CLEAN: Controller only handles HTTP concerns
    ✅ CLEAN: Business logic in use case
    ✅ CLEAN: Authentication required
    """
    try:
        return await use_case.execute(current_user.id, order_data)
    except EmptyOrderException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except ProductNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except InsufficientStockException as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except InvalidOrderDataException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the order"
        )


@router.get(
    "/{order_id}",
    response_model=OrderResponseDTO,
    summary="Get order by ID",
    description="Retrieve a single order by its ID"
)
async def get_order(
    order_id: int,
    current_user: User = Depends(get_current_active_user),
    use_case: GetOrderByIdUseCase = Depends(get_get_order_use_case)
) -> OrderResponseDTO:
    """
    Get an order by ID.
    
    Users can only view their own orders unless admin.
    """
    try:
        # Regular users can only see their own orders
        user_id = None if current_user.is_admin() else current_user.id
        return await use_case.execute(order_id, user_id)
    except OrderNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the order"
        )


@router.get(
    "/",
    response_model=OrderListResponseDTO,
    summary="Get user's orders",
    description="Retrieve all orders for the current user"
)
async def get_my_orders(
    skip: int = Query(0, ge=0, description="Number of orders to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of orders to return"),
    status: Optional[OrderStatus] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_active_user),
    use_case: GetUserOrdersUseCase = Depends(get_get_user_orders_use_case)
) -> OrderListResponseDTO:
    """
    Get all orders for current user.
    
    Supports pagination and status filtering.
    """
    try:
        return await use_case.execute(
            user_id=current_user.id,
            skip=skip,
            limit=limit,
            status=status
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving orders"
        )


@router.patch(
    "/{order_id}/status",
    response_model=OrderResponseDTO,
    summary="Update order status",
    description="Update the status of an order (admin only)"
)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdateDTO,
    current_user: User = Depends(get_current_active_user),
    use_case: UpdateOrderStatusUseCase = Depends(get_update_order_status_use_case)
) -> OrderResponseDTO:
    """
    Update order status.
    
    Admin-only endpoint for managing order workflow.
    """
    # Check if user is admin
    if not current_user.is_admin():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update order status"
        )
    
    try:
        return await use_case.execute(order_id, status_update)
    except OrderNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except InvalidOrderStatusTransitionException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating order status"
        )


