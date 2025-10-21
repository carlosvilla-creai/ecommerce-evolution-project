"""
Dependency Injection for Users Module

Provides FastAPI dependencies for use cases.
"""
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..application.use_cases import (
    RegisterUserUseCase,
    LoginUserUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase
)
from .db.repositories.user_repository import UserRepository
from src.shared.database import get_db


# Repository dependency
async def get_user_repository(
    session: AsyncSession = Depends(get_db)
) -> UserRepository:
    """Get user repository with database session"""
    return UserRepository(session)


# Use case dependencies
async def get_register_user_use_case(
    repository: UserRepository = Depends(get_user_repository)
) -> RegisterUserUseCase:
    """Get register user use case"""
    return RegisterUserUseCase(repository)


async def get_login_user_use_case(
    repository: UserRepository = Depends(get_user_repository)
) -> LoginUserUseCase:
    """Get login user use case"""
    return LoginUserUseCase(repository)


async def get_get_user_profile_use_case(
    repository: UserRepository = Depends(get_user_repository)
) -> GetUserProfileUseCase:
    """Get user profile use case"""
    return GetUserProfileUseCase(repository)


async def get_update_user_profile_use_case(
    repository: UserRepository = Depends(get_user_repository)
) -> UpdateUserProfileUseCase:
    """Get update user profile use case"""
    return UpdateUserProfileUseCase(repository)

