"""
Dependency Injection for Products Module

This file provides FastAPI dependencies that construct use cases
with their required dependencies.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..application.use_cases import (
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase
)
from .db.repositories.product_repository import ProductRepository
from src.shared.database import get_db


# Repository dependency
async def get_product_repository(
    session: AsyncSession = Depends(get_db)
) -> ProductRepository:
    """Get product repository with database session"""
    return ProductRepository(session)


# Use case dependencies
async def get_create_product_use_case(
    repository: ProductRepository = Depends(get_product_repository)
) -> CreateProductUseCase:
    """Get create product use case"""
    return CreateProductUseCase(repository)


async def get_get_product_use_case(
    repository: ProductRepository = Depends(get_product_repository)
) -> GetProductByIdUseCase:
    """Get product by ID use case"""
    return GetProductByIdUseCase(repository)


async def get_get_products_use_case(
    repository: ProductRepository = Depends(get_product_repository)
) -> GetProductsUseCase:
    """Get products use case"""
    return GetProductsUseCase(repository)


async def get_update_product_use_case(
    repository: ProductRepository = Depends(get_product_repository)
) -> UpdateProductUseCase:
    """Get update product use case"""
    return UpdateProductUseCase(repository)


async def get_delete_product_use_case(
    repository: ProductRepository = Depends(get_product_repository)
) -> DeleteProductUseCase:
    """Get delete product use case"""
    return DeleteProductUseCase(repository)

