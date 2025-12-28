from fastapi import FastAPI
from routes.product_routes import router as product_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Product Service is running!"}

# Register product routes
app.include_router(product_router, prefix="/api/products")
