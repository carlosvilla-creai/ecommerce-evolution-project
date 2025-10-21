"""
Update User Profile Use Case

Handles updating user profile information.
"""
from ...domain.interfaces.repositories import IUserRepository
from ...domain.exceptions import UserNotFoundException
from ..dto.user_dto import UserUpdateDTO, UserResponseDTO


class UpdateUserProfileUseCase:
    """Use case for updating user profile"""
    
    def __init__(self, user_repository: IUserRepository):
        """
        Initialize use case with repository dependency.
        
        Args:
            user_repository: Repository for user data access
        """
        self.user_repository = user_repository
    
    async def execute(self, user_id: int, update_data: UserUpdateDTO) -> UserResponseDTO:
        """
        Execute the update user profile use case.
        
        Args:
            user_id: ID of the user to update
            update_data: DTO with fields to update
            
        Returns:
            UserResponseDTO with updated user data
            
        Raises:
            UserNotFoundException: If user not found
        """
        # Get existing user
        user = await self.user_repository.get_by_id(user_id)
        
        if not user:
            raise UserNotFoundException(user_id=user_id)
        
        # Apply updates
        update_dict = update_data.dict(exclude_unset=True)
        
        for field, value in update_dict.items():
            if hasattr(user, field) and value is not None:
                setattr(user, field, value)
        
        # Update in repository
        updated_user = await self.user_repository.update(user)
        
        # Convert to response DTO
        return UserResponseDTO(
            id=updated_user.id,
            email=updated_user.email,
            first_name=updated_user.first_name,
            last_name=updated_user.last_name,
            full_name=updated_user.get_full_name(),
            is_active=updated_user.is_active,
            role=updated_user.role,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at
        )

