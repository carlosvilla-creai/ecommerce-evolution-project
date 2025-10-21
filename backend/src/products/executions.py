"""
Dependency Injection Container (Optional Alternative)

This file provides an alternative DI container approach.
The main DI is handled in infrastructure/dependencies.py for FastAPI.

This can be used for non-FastAPI contexts (CLI tools, background jobs, etc.)
"""
from sqlalchemy.ext.asyncio import AsyncSession

from .domain.interfaces.repositories import IProductRepository
from .infrastructure.db.repositories.product_repository import ProductRepository
from .application.use_cases import (
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase
)


class ProductDIContainer:
    """
    Dependency Injection container for Products module.
    
    This is useful for scenarios outside of FastAPI request handling.
    """
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self._repository: IProductRepository = None
    
    @property
    def repository(self) -> IProductRepository:
        """Get or create repository instance"""
        if self._repository is None:
            self._repository = ProductRepository(self.session)
        return self._repository
    
    def get_create_product_use_case(self) -> CreateProductUseCase:
        """Get create product use case"""
        return CreateProductUseCase(self.repository)
    
    def get_get_product_use_case(self) -> GetProductByIdUseCase:
        """Get product by ID use case"""
        return GetProductByIdUseCase(self.repository)
    
    def get_get_products_use_case(self) -> GetProductsUseCase:
        """Get products use case"""
        return GetProductsUseCase(self.repository)
    
    def get_update_product_use_case(self) -> UpdateProductUseCase:
        """Get update product use case"""
        return UpdateProductUseCase(self.repository)
    
    def get_delete_product_use_case(self) -> DeleteProductUseCase:
        """Get delete product use case"""
        return DeleteProductUseCase(self.repository)

