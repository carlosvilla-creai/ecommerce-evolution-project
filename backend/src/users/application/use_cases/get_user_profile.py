"""
Get User Profile Use Case

Retrieves user profile information.
"""
from ...domain.interfaces.repositories import IUserRepository
from ...domain.exceptions import UserNotFoundException
from ..dto.user_dto import UserResponseDTO


class GetUserProfileUseCase:
    """Use case for retrieving user profile"""
    
    def __init__(self, user_repository: IUserRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            user_repository: Repository for user data access
        """
        self.user_repository = user_repository
    
    async def execute(self, user_id: int) -> UserResponseDTO:
        """
        Execute the get user profile use case.
        
        Args:
            user_id: ID of the user to retrieve
            
        Returns:
            UserResponseDTO with user data
            
        Raises:
            UserNotFoundException: If user not found
        """
        user = await self.user_repository.get_by_id(user_id)
        
        if not user:
            raise UserNotFoundException(user_id=user_id)
        
        return UserResponseDTO(
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

