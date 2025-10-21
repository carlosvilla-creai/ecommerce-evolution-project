"""
Get Product By ID Use Case

This use case handles retrieving a single product by its ID.
"""
from ...domain.interfaces.repositories import IProductRepository
from ...domain.exceptions import ProductNotFoundException
from ..dto.product_dto import ProductResponseDTO


class GetProductByIdUseCase:
    """Use case for retrieving a product by ID"""
    
    def __init__(self, product_repository: IProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            product_repository: Repository for product data access
        """
        self.product_repository = product_repository
    
    async def execute(self, product_id: int) -> ProductResponseDTO:
        """
        Execute the get product by ID use case.
        
        Args:
            product_id: ID of the product to retrieve
            
        Returns:
            ProductResponseDTO with product data
            
        Raises:
            ProductNotFoundException: If product not found
        """
        product = await self.product_repository.get_by_id(product_id)
        
        if not product:
            raise ProductNotFoundException(product_id)
        
        return ProductResponseDTO(
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

