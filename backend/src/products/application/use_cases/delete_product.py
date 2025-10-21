"""
Delete Product Use Case

This use case handles deleting a product (soft delete by default).
"""
from ...domain.interfaces.repositories import IProductRepository
from ...domain.exceptions import ProductNotFoundException


class DeleteProductUseCase:
    """Use case for deleting a product"""
    
    def __init__(self, product_repository: IProductRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            product_repository: Repository for product data access
        """
        self.product_repository = product_repository
    
    async def execute(self, product_id: int, soft_delete: bool = True) -> bool:
        """
        Execute the delete product use case.
        
        Args:
            product_id: ID of the product to delete
            soft_delete: If True, deactivate product; if False, hard delete
            
        Returns:
            True if deleted successfully
            
        Raises:
            ProductNotFoundException: If product not found
        """
        # Check if product exists
        exists = await self.product_repository.exists(product_id)
        
        if not exists:
            raise ProductNotFoundException(product_id)
        
        if soft_delete:
            # Soft delete: set is_active to False
            product = await self.product_repository.get_by_id(product_id)
            product.deactivate()
            await self.product_repository.update(product)
        else:
            # Hard delete: remove from database
            await self.product_repository.delete(product_id)
        
        return True

