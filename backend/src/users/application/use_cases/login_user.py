"""
Login User Use Case

Handles user authentication and JWT token generation.
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
import os

from ...domain.interfaces.repositories import IUserRepository
from ...domain.exceptions import (
    InvalidCredentialsException,
    UserNotFoundException,
    UserInactiveException
)
from ..dto.user_dto import UserLoginDTO, TokenResponseDTO, UserResponseDTO


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class LoginUserUseCase:
    """
    Use case for user authentication and login.
    
    Generates JWT tokens for authenticated users.
    """
    
    def __init__(self, user_repository: IUserRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            user_repository: Repository for user data access
        """
        self.user_repository = user_repository
    
    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password against hashed password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def _create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    async def execute(self, login_data: UserLoginDTO) -> TokenResponseDTO:
        """
        Execute the login use case.
        
        Args:
            login_data: DTO with login credentials
            
        Returns:
            TokenResponseDTO with JWT token and user data
            
        Raises:
            InvalidCredentialsException: If credentials are invalid
            UserInactiveException: If user account is inactive
        """
        # Get user by email
        user = await self.user_repository.get_by_email(login_data.email)
        
        if not user:
            raise InvalidCredentialsException()
        
        # Verify password
        if not self._verify_password(login_data.password, user.hashed_password):
            raise InvalidCredentialsException()
        
        # Check if user is active
        if not user.is_active:
            raise UserInactiveException(user.id)
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = self._create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email,
                "role": user.role
            },
            expires_delta=access_token_expires
        )
        
        # Create user response DTO
        user_response = UserResponseDTO(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            full_name=user.get_full_name(),
            is_active=user.is_active,
            role=user.role,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
        
        # Return token response
        return TokenResponseDTO(
            access_token=access_token,
            token_type="bearer",
            user=user_response
        )

