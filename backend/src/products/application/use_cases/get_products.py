"""
Get Products Use Case

This use case handles retrieving a filtered and paginated list of products.
"""
from typing import List

from ...domain.interfaces.repositories import IProductRepository
from ..dto.product_dto import ProductFilterDTO, ProductListResponseDTO, ProductResponseDTO


class GetProductsUseCase:
    """Use case for retrieving a list of products with filtering"""
    
    def __init__(self, product_repository: IProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            product_repository: Repository for product data access
        """
        self.product_repository = product_repository
    
    async def execute(self, filters: ProductFilterDTO) -> ProductListResponseDTO:
        """
        Execute the get products use case.
        
        Args:
            filters: DTO with filter parameters
            
        Returns:
            ProductListResponseDTO with products and pagination info
        """
        # Get filtered products from repository
        products = await self.product_repository.get_all(
            skip=filters.skip,
            limit=filters.limit,
            category=filters.category,
            min_price=filters.min_price,
            max_price=filters.max_price,
            search=filters.search,
            active_only=filters.active_only
        )
        
        # Get total count for pagination
        total = await self.product_repository.count(
            category=filters.category,
            active_only=filters.active_only
        )
        
        # Convert domain entities to response DTOs
        product_responses: List[ProductResponseDTO] = [
            ProductResponseDTO(
                id=product.id,
                name=product.name,
                price=product.price,
                stock=product.stock,
                category=product.category,
                description=product.description,
                is_active=product.is_active,
                created_at=product.created_at,
                updated_at=product.updated_at
            )
            for product in products
        ]
        
        return ProductListResponseDTO(
            products=product_responses,
            total=total,
            skip=filters.skip,
            limit=filters.limit
        )

