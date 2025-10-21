"""
Data Transfer Objects for Product use cases

DTOs are used to transfer data between layers without exposing domain entities.
They provide a clear contract for API inputs and outputs.
"""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class ProductCreateDTO(BaseModel):
    """DTO for creating a new product"""
    name: str = Field(..., min_length=1, max_length=255, description="Product name")
    price: Decimal = Field(..., gt=0, description="Product price")
    stock: int = Field(..., ge=0, description="Initial stock quantity")
    category: str = Field(..., min_length=1, max_length=100, description="Product category")
    description: Optional[str] = Field(None, max_length=2000, description="Product description")
    
    @validator('name', 'category')
    def strip_whitespace(cls, v: str) -> str:
        """Remove leading/trailing whitespace"""
        return v.strip()
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Wireless Mouse",
                "price": "29.99",
                "stock": 100,
                "category": "Electronics",
                "description": "Ergonomic wireless mouse with long battery life"
            }
        }


class ProductUpdateDTO(BaseModel):
    """DTO for updating an existing product"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    price: Optional[Decimal] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=2000)
    is_active: Optional[bool] = None
    
    @validator('name', 'category')
    def strip_whitespace(cls, v: Optional[str]) -> Optional[str]:
        """Remove leading/trailing whitespace"""
        return v.strip() if v else None
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Updated Product Name",
                "price": "34.99",
                "stock": 50
            }
        }


class ProductResponseDTO(BaseModel):
    """DTO for product response"""
    id: int
    name: str
    price: Decimal
    stock: int
    category: str
    description: Optional[str]
    is_active: bool
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    
    class Config:
        json_encoders = {
            Decimal: str,
            datetime: lambda v: v.isoformat() if v else None
        }
        
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Wireless Mouse",
                "price": "29.99",
                "stock": 100,
                "category": "Electronics",
                "description": "Ergonomic wireless mouse with long battery life",
                "is_active": True,
                "created_at": "2024-01-15T10:30:00",
                "updated_at": "2024-01-15T10:30:00"
            }
        }


class ProductFilterDTO(BaseModel):
    """DTO for filtering products"""
    category: Optional[str] = None
    min_price: Optional[Decimal] = Field(None, ge=0)
    max_price: Optional[Decimal] = Field(None, ge=0)
    search: Optional[str] = None
    skip: int = Field(0, ge=0, description="Number of records to skip")
    limit: int = Field(20, ge=1, le=100, description="Maximum number of records")
    active_only: bool = Field(True, description="Return only active products")
    
    @validator('max_price')
    def validate_price_range(cls, v, values):
        """Validate that max_price is greater than min_price"""
        if v is not None and 'min_price' in values and values['min_price'] is not None:
            if v < values['min_price']:
                raise ValueError('max_price must be greater than min_price')
        return v


class ProductListResponseDTO(BaseModel):
    """DTO for paginated list of products"""
    products: List[ProductResponseDTO]
    total: int
    skip: int
    limit: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "products": [
                    {
                        "id": 1,
                        "name": "Wireless Mouse",
                        "price": "29.99",
                        "stock": 100,
                        "category": "Electronics",
                        "description": "Ergonomic wireless mouse",
                        "is_active": True,
                        "created_at": "2024-01-15T10:30:00",
                        "updated_at": "2024-01-15T10:30:00"
                    }
                ],
                "total": 1,
                "skip": 0,
                "limit": 20
            }
        }

