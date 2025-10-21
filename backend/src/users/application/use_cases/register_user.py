"""
Register User Use Case

Handles user registration with validation and password hashing.
"""
from passlib.context import CryptContext
from ...domain.models.user import User
from ...domain.interfaces.repositories import IUserRepository
from ...domain.exceptions import UserAlreadyExistsException
from ..dto.user_dto import UserRegisterDTO, UserResponseDTO


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterUserUseCase:
    """
    Use case for registering a new user.
    
    Follows Single Responsibility Principle - only handles user registration.
    """
    
    def __init__(self, user_repository: IUserRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            user_repository: Repository for user data access
        """
        self.user_repository = user_repository
    
    async def execute(self, register_data: UserRegisterDTO) -> UserResponseDTO:
        """
        Execute the user registration use case.
        
        Args:
            register_data: DTO with registration data
            
        Returns:
            UserResponseDTO with created user data
            
        Raises:
            UserAlreadyExistsException: If email already exists
        """
        # Check if user already exists
        exists = await self.user_repository.exists_by_email(register_data.email)
        if exists:
            raise UserAlreadyExistsException(register_data.email)
        
        # Hash password
        hashed_password = pwd_context.hash(register_data.password)
        
        # Create domain entity
        user = User(
            email=register_data.email,
            hashed_password=hashed_password,
            first_name=register_data.first_name,
            last_name=register_data.last_name,
            is_active=True,
            role="customer"
        )
        
        # Save to repository
        created_user = await self.user_repository.create(user)
        
        # Convert to response DTO
        return UserResponseDTO(
            id=created_user.id,
            email=created_user.email,
            first_name=created_user.first_name,
            last_name=created_user.last_name,
            full_name=created_user.get_full_name(),
            is_active=created_user.is_active,
            role=created_user.role,
            created_at=created_user.created_at,
            updated_at=created_user.updated_at
        )

