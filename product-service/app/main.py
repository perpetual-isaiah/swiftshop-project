from app.db.database import Base, engine
from app.models.product import Product  # noqa
from app.models.product_image import ProductImage  # noqa


from fastapi import FastAPI
from app.api.product_routes import router as product_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Product Service is running!"}

# Register product routes
app.include_router(product_router, prefix="/api/products", tags=["Products"])
