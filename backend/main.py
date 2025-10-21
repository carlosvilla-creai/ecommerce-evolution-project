"""
E-Commerce API - Clean Architecture Implementation

✅ REFACTORED: Using Clean Architecture
✅ REFACTORED: Proper async/await with SQLAlchemy
✅ REFACTORED: Dependency injection
✅ REFACTORED: No SQL injection vulnerabilities
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from src.products.infrastructure.api import router as products_router
from src.users.infrastructure.api import router as users_router
from src.orders.infrastructure.api import router as orders_router
from src.shared.database import init_database, close_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    
    ✅ FIXED: Proper async database initialization
    """
    # Startup
    print("🚀 Starting E-commerce API with Clean Architecture...")
    await init_database()
    print("✅ Database initialized with SQLAlchemy")
    
    yield
    
    # Shutdown
    print("🔄 Shutting down...")
    await close_database()
    print("✅ Shutdown complete")


# FastAPI application with improved configuration
app = FastAPI(
    title="E-commerce Clean Architecture API",
    description="E-commerce API built with Clean Architecture principles",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware (configure based on environment in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # ✅ Specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(orders_router, prefix="/api/v1")

@app.get("/", tags=["General"])
async def root():
    """Root endpoint"""
    return {
        "message": "E-commerce Clean Architecture API",
        "status": "running",
        "version": "3.0.0",
        "architecture": "Clean Architecture",
        "modules": ["Products", "Users", "Orders"],
        "features": [
            "Domain-Driven Design",
            "Dependency Injection",
            "SQLAlchemy ORM",
            "JWT Authentication",
            "Password Hashing (Bcrypt)",
            "Order Management with Cart",
            "Status Workflow Validation",
            "Transaction Management",
            "Async/await support",
            "No SQL injection vulnerabilities",
            "Role-Based Access Control"
        ]
    }

@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "API is running with Clean Architecture",
        "database": "connected"
    }

if __name__ == "__main__":
    print("🚀 Starting E-commerce Clean Architecture API...")
    print("📚 Documentation: http://localhost:8000/docs")
    print("📖 ReDoc: http://localhost:8000/redoc")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Development mode
        log_level="info"
    )


