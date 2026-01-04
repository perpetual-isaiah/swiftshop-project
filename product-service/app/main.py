from app.db.database import Base, engine
from app.models.product import Product  # noqa
from app.models.product_image import ProductImage  # noqa


from fastapi import FastAPI
from app.api.product_routes import router as product_router
from app.db.database import engine, Base  # ✅ ADD THIS

Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ CREATE TABLES IN POSTGRES
Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Product Service is running!"}

# Register product routes
app.include_router(
    product_router,
    prefix="/api/products",
    tags=["Products"]
)
