"""
Domain-specific exceptions for Users

These exceptions represent business rule violations and domain errors.
"""
from typing import Optional


class UserDomainException(Exception):
    """Base exception for user domain errors"""
    pass


class UserNotFoundException(UserDomainException):
    """Raised when a user is not found"""
    
    def __init__(self, user_id: Optional[int] = None, email: Optional[str] = None):
        self.user_id = user_id
        self.email = email
        if user_id:
            message = f"User with ID {user_id} not found"
        elif email:
            message = f"User with email {email} not found"
        else:
            message = "User not found"
        super().__init__(message)


class UserAlreadyExistsException(UserDomainException):
    """Raised when trying to create a user that already exists"""
    
    def __init__(self, email: str):
        self.email = email
        super().__init__(f"User with email '{email}' already exists")


class InvalidCredentialsException(UserDomainException):
    """Raised when login credentials are invalid"""
    
    def __init__(self, message: str = "Invalid email or password"):
        super().__init__(message)


class InvalidPasswordException(UserDomainException):
    """Raised when password doesn't meet requirements"""
    
    def __init__(self, message: str):
        super().__init__(message)


class UserInactiveException(UserDomainException):
    """Raised when trying to perform operations on inactive user"""
    
    def __init__(self, user_id: int):
        self.user_id = user_id
        super().__init__(f"User {user_id} is inactive")


class UnauthorizedAccessException(UserDomainException):
    """Raised when user doesn't have required permissions"""
    
    def __init__(self, message: str = "Unauthorized access"):
        super().__init__(message)


class InvalidTokenException(UserDomainException):
    """Raised when JWT token is invalid or expired"""
    
    def __init__(self, message: str = "Invalid or expired token"):
        super().__init__(message)

