"""
Create Product Use Case

This use case handles the business logic for creating a new product.
It validates input, applies business rules, and coordinates with the repository.
"""
from ...domain.models.product import Product
from ...domain.interfaces.repositories import IProductRepository
from ...domain.exceptions import InvalidProductDataException
from ..dto.product_dto import ProductCreateDTO, ProductResponseDTO


class CreateProductUseCase:
    """
    Use case for creating a new product.
    
    Follows Single Responsibility Principle - only handles product creation logic.
    """
    
    def __init__(self, product_repository: IProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            product_repository: Repository for product data access
        """
        self.product_repository = product_repository
    
    async def execute(self, product_data: ProductCreateDTO) -> ProductResponseDTO:
        """
        Execute the create product use case.
        
        Args:
            product_data: DTO with product creation data
            
        Returns:
            ProductResponseDTO with created product data
            
        Raises:
            InvalidProductDataException: If product data is invalid
        """
        try:
            # Create domain entity from DTO
            product = Product(
                name=product_data.name,
                price=product_data.price,
                stock=product_data.stock,
                category=product_data.category,
                description=product_data.description,
                is_active=True
            )
            
            # Delegate to repository
            created_product = await self.product_repository.create(product)
            
            # Convert domain entity to response DTO
            return ProductResponseDTO(
                id=created_product.id,
                name=created_product.name,
                price=created_product.price,
                stock=created_product.stock,
                category=created_product.category,
                description=created_product.description,
                is_active=created_product.is_active,
                created_at=created_product.created_at,
                updated_at=created_product.updated_at
            )
            
        except ValueError as e:
            raise InvalidProductDataException(str(e))

