"""
Clean API Endpoints for Products

✅ FIXED: Proper separation of concerns
✅ FIXED: No business logic in controllers
✅ FIXED: Dependency injection
✅ FIXED: Proper error handling
✅ FIXED: No SQL injection
"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional
from decimal import Decimal

from ...application.use_cases import (
    CreateProductUseCase,
    GetProductByIdUseCase,
    GetProductsUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase
)
from ...application.dto.product_dto import (
    ProductCreateDTO,
    ProductUpdateDTO,
    ProductResponseDTO,
    ProductListResponseDTO,
    ProductFilterDTO
)
from ...domain.exceptions import (
    ProductNotFoundException,
    InvalidProductDataException
)
from ..dependencies import (
    get_create_product_use_case,
    get_get_product_use_case,
    get_get_products_use_case,
    get_update_product_use_case,
    get_delete_product_use_case
)


router = APIRouter(prefix="/products", tags=["Products"])


@router.post(
    "/",
    response_model=ProductResponseDTO,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new product",
    description="Create a new product with the provided data"
)
async def create_product(
    product_data: ProductCreateDTO,
    use_case: CreateProductUseCase = Depends(get_create_product_use_case)
) -> ProductResponseDTO:
    """
    Create a new product.
    
    ✅ CLEAN: Controller only handles HTTP concerns
    ✅ CLEAN: Business logic is in use case
    ✅ CLEAN: Dependency injection for testability
    """
    try:
        return await use_case.execute(product_data)
    except InvalidProductDataException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the product"
        )


@router.get(
    "/{product_id}",
    response_model=ProductResponseDTO,
    summary="Get product by ID",
    description="Retrieve a single product by its ID"
)
async def get_product(
    product_id: int,
    use_case: GetProductByIdUseCase = Depends(get_get_product_use_case)
) -> ProductResponseDTO:
    """Get a product by ID"""
    try:
        return await use_case.execute(product_id)
    except ProductNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the product"
        )


@router.get(
    "/",
    response_model=ProductListResponseDTO,
    summary="Get all products",
    description="Retrieve a filtered and paginated list of products"
)
async def get_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[Decimal] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[Decimal] = Query(None, ge=0, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in product name and description"),
    skip: int = Query(0, ge=0, description="Number of products to skip"),
    limit: int = Query(20, ge=1, le=100, description="Number of products to return"),
    active_only: bool = Query(True, description="Return only active products"),
    use_case: GetProductsUseCase = Depends(get_get_products_use_case)
) -> ProductListResponseDTO:
    """
    Get all products with optional filtering and pagination.
    
    ✅ CLEAN: Query parameters validated by FastAPI
    ✅ CLEAN: Use case handles all business logic
    """
    try:
        filters = ProductFilterDTO(
            category=category,
            min_price=min_price,
            max_price=max_price,
            search=search,
            skip=skip,
            limit=limit,
            active_only=active_only
        )
        return await use_case.execute(filters)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving products"
        )


@router.put(
    "/{product_id}",
    response_model=ProductResponseDTO,
    summary="Update a product",
    description="Update an existing product with the provided data"
)
async def update_product(
    product_id: int,
    product_data: ProductUpdateDTO,
    use_case: UpdateProductUseCase = Depends(get_update_product_use_case)
) -> ProductResponseDTO:
    """Update an existing product"""
    try:
        return await use_case.execute(product_id, product_data)
    except ProductNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except InvalidProductDataException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the product"
        )


@router.delete(
    "/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a product",
    description="Delete a product (soft delete by default)"
)
async def delete_product(
    product_id: int,
    hard_delete: bool = Query(False, description="If true, permanently delete the product"),
    use_case: DeleteProductUseCase = Depends(get_delete_product_use_case)
):
    """
    Delete a product.
    
    By default performs soft delete (sets is_active=False).
    Set hard_delete=True for permanent deletion.
    """
    try:
        await use_case.execute(product_id, soft_delete=not hard_delete)
        return None
    except ProductNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the product"
        )

