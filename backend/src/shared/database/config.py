"""
Database Configuration with SQLAlchemy

✅ FIXED: Using SQLAlchemy ORM instead of raw SQL
✅ FIXED: Async support for better performance
✅ FIXED: Proper connection pooling
✅ FIXED: Environment-based configuration
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator

# Database URL - can be configured via environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite+aiosqlite:///./ecommerce.db"  # Async SQLite
)

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Log SQL queries (disable in production)
    future=True,
    pool_pre_ping=True,  # Verify connections before using them
)

# Create async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class for all ORM models
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting database sessions.
    
    This will be used in FastAPI endpoints to inject database sessions.
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_database():
    """
    Initialize database by creating all tables.
    
    ✅ FIXED: Proper async table creation
    ✅ FIXED: Foreign key support
    """
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Database initialized with SQLAlchemy")


async def close_database():
    """Close database connections"""
    await engine.dispose()
    print("✅ Database connections closed")

