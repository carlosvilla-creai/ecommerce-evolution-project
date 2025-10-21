"""
Clean API Endpoints for Users

✅ CLEAN: Proper separation of concerns
✅ CLEAN: No business logic in controllers
✅ CLEAN: Dependency injection
✅ CLEAN: Proper error handling
"""
from fastapi import APIRouter, HTTPException, Depends, status

from ...application.use_cases import (
    RegisterUserUseCase,
    LoginUserUseCase,
    GetUserProfileUseCase,
    UpdateUserProfileUseCase
)
from ...application.dto.user_dto import (
    UserRegisterDTO,
    UserLoginDTO,
    UserResponseDTO,
    UserUpdateDTO,
    TokenResponseDTO
)
from ...domain.exceptions import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
    UserNotFoundException,
    UserInactiveException,
    InvalidPasswordException
)
from ...domain.models.user import User
from ..dependencies import (
    get_register_user_use_case,
    get_login_user_use_case,
    get_get_user_profile_use_case,
    get_update_user_profile_use_case
)
from ..auth.jwt_handler import get_current_active_user


router = APIRouter(prefix="/users", tags=["Users"])


@router.post(
    "/register",
    response_model=UserResponseDTO,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email and password"
)
async def register(
    user_data: UserRegisterDTO,
    use_case: RegisterUserUseCase = Depends(get_register_user_use_case)
) -> UserResponseDTO:
    """
    Register a new user.
    
    ✅ CLEAN: Controller only handles HTTP concerns
    ✅ CLEAN: Business logic in use case
    """
    try:
        return await use_case.execute(user_data)
    except UserAlreadyExistsException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post(
    "/login",
    response_model=TokenResponseDTO,
    summary="Login user",
    description="Authenticate user and return JWT token"
)
async def login(
    login_data: UserLoginDTO,
    use_case: LoginUserUseCase = Depends(get_login_user_use_case)
) -> TokenResponseDTO:
    """Login user and return JWT token"""
    try:
        return await use_case.execute(login_data)
    except InvalidCredentialsException as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except UserInactiveException as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )


@router.get(
    "/me",
    response_model=UserResponseDTO,
    summary="Get current user profile",
    description="Get the profile of the currently authenticated user"
)
async def get_profile(
    current_user: User = Depends(get_current_active_user)
) -> UserResponseDTO:
    """Get current user profile"""
    return UserResponseDTO(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        full_name=current_user.get_full_name(),
        is_active=current_user.is_active,
        role=current_user.role,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )


@router.put(
    "/me",
    response_model=UserResponseDTO,
    summary="Update current user profile",
    description="Update the profile of the currently authenticated user"
)
async def update_profile(
    update_data: UserUpdateDTO,
    current_user: User = Depends(get_current_active_user),
    use_case: UpdateUserProfileUseCase = Depends(get_update_user_profile_use_case)
) -> UserResponseDTO:
    """Update current user profile"""
    try:
        return await use_case.execute(current_user.id, update_data)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating profile"
        )


@router.get(
    "/{user_id}",
    response_model=UserResponseDTO,
    summary="Get user by ID",
    description="Get user profile by ID (admin only in production)"
)
async def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),  # Requires authentication
    use_case: GetUserProfileUseCase = Depends(get_get_user_profile_use_case)
) -> UserResponseDTO:
    """Get user by ID"""
    try:
        return await use_case.execute(user_id)
    except UserNotFoundException as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving user"
        )

