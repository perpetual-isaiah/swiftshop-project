import time
from sqlalchemy.exc import OperationalError
from app.db.database import Base, engine
from app.models.product import Product  # noqa
from app.models.product_image import ProductImage  # noqa
from fastapi import FastAPI
from app.api.product_routes import router as product_router

# Database connection with retry logic
max_retries = 10
retry_delay = 3

print("🔄 Attempting to connect to database...")
for attempt in range(max_retries):
    try:
        # Try to create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database connection successful! Tables created.")
        break
    except OperationalError as e:
        if attempt < max_retries - 1:
            print(f"⏳ Database not ready (attempt {attempt + 1}/{max_retries}). Retrying in {retry_delay}s...")
            print(f"   Error: {str(e)[:100]}")
            time.sleep(retry_delay)
        else:
            print(f"❌ Failed to connect to database after {max_retries} attempts")
            print(f"   Last error: {e}")
            raise

# Initialize FastAPI app
app = FastAPI(
    title="Product Service",
    description="Microservice for managing products",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Product Service is running!",
        "status": "healthy",
        "service": "product-service"
    }

@app.get("/health")
def health_check():
    try:
        # Test database connection
        engine.connect()
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

# Register product routes
app.include_router(
    product_router,
    prefix="/api/products",
    tags=["Products"]
)