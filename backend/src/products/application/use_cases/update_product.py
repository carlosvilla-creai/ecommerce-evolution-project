"""
Update Product Use Case

This use case handles updating an existing product with partial or full data.
"""
from ...domain.interfaces.repositories import IProductRepository
from ...domain.exceptions import ProductNotFoundException, InvalidProductDataException
from ..dto.product_dto import ProductUpdateDTO, ProductResponseDTO


class UpdateProductUseCase:
    """Use case for updating an existing product"""
    
    def __init__(self, product_repository: IProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            product_repository: Repository for product data access
        """
        self.product_repository = product_repository
    
    async def execute(
        self, 
        product_id: int, 
        update_data: ProductUpdateDTO
    ) -> ProductResponseDTO:
        """
        Execute the update product use case.
        
        Args:
            product_id: ID of the product to update
            update_data: DTO with fields to update
            
        Returns:
            ProductResponseDTO with updated product data
            
        Raises:
            ProductNotFoundException: If product not found
            InvalidProductDataException: If update data is invalid
        """
        # Get existing product
        product = await self.product_repository.get_by_id(product_id)
        
        if not product:
            raise ProductNotFoundException(product_id)
        
        try:
            # Apply updates only for fields that were provided
            update_dict = update_data.dict(exclude_unset=True)
            
            for field, value in update_dict.items():
                if hasattr(product, field):
                    setattr(product, field, value)
            
            # Update in repository
            updated_product = await self.product_repository.update(product)
            
            # Convert to response DTO
            return ProductResponseDTO(
                id=updated_product.id,
                name=updated_product.name,
                price=updated_product.price,
                stock=updated_product.stock,
                category=updated_product.category,
                description=updated_product.description,
                is_active=updated_product.is_active,
                created_at=updated_product.created_at,
                updated_at=updated_product.updated_at
            )
            
        except ValueError as e:
            raise InvalidProductDataException(str(e))

