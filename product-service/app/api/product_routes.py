from fastapi import APIRouter
from app.schemas.product_schema import ProductCreate

router = APIRouter()

# TEMP: until PostgreSQL is wired up
_fake_db = []
_next_id = 1

@router.post("/")
def create_product(product: ProductCreate):
    global _next_id
    item = product.dict()
    item["id"] = _next_id
    _next_id += 1
    _fake_db.append(item)
    return {"message": "Product created", "id": item["id"]}

@router.get("/")
def get_products():
    return _fake_db
