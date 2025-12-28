# routes/product_routes.py
from fastapi import APIRouter
from models.Product import Product
from database import db

router = APIRouter()

# COLLECTION
products_collection = db["products"]


@router.post("/")
def create_product(product: Product):
    data = product.dict()
    result = products_collection.insert_one(data)
    return {"message": "Product created", "id": str(result.inserted_id)}


@router.get("/")
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return products
