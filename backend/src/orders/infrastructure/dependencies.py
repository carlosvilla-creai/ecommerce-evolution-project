"""
Dependency Injection for Orders Module

Provides FastAPI dependencies for use cases.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..application.use_cases import (
    CreateOrderUseCase,
    GetOrderByIdUseCase,
    GetUserOrdersUseCase,
    UpdateOrderStatusUseCase
)
from .db.repositories.order_repository import OrderRepository
from src.products.infrastructure.db.repositories.product_repository import ProductRepository
from src.users.infrastructure.db.repositories.user_repository import UserRepository
from src.shared.database import get_db


# Repository dependencies
async def get_order_repository(
    session: AsyncSession = Depends(get_db)
) -> OrderRepository:
    """Get order repository with database session"""
    return OrderRepository(session)


async def get_product_repository(
    session: AsyncSession = Depends(get_db)
) -> ProductRepository:
    """Get product repository with database session"""
    return ProductRepository(session)


async def get_user_repository(
    session: AsyncSession = Depends(get_db)
) -> UserRepository:
    """Get user repository with database session"""
    return UserRepository(session)


# Use case dependencies
async def get_create_order_use_case(
    order_repository: OrderRepository = Depends(get_order_repository),
    product_repository: ProductRepository = Depends(get_product_repository),
    user_repository: UserRepository = Depends(get_user_repository)
) -> CreateOrderUseCase:
    """Get create order use case"""
    return CreateOrderUseCase(order_repository, product_repository, user_repository)


async def get_get_order_use_case(
    order_repository: OrderRepository = Depends(get_order_repository)
) -> GetOrderByIdUseCase:
    """Get order by ID use case"""
    return GetOrderByIdUseCase(order_repository)


async def get_get_user_orders_use_case(
    order_repository: OrderRepository = Depends(get_order_repository)
) -> GetUserOrdersUseCase:
    """Get user orders use case"""
    return GetUserOrdersUseCase(order_repository)


async def get_update_order_status_use_case(
    order_repository: OrderRepository = Depends(get_order_repository)
) -> UpdateOrderStatusUseCase:
    """Get update order status use case"""
    return UpdateOrderStatusUseCase(order_repository)


