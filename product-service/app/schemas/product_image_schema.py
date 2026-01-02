from pydantic import BaseModel
from typing import Optional

class ProductImageBase(BaseModel):
    image_url: str
    is_primary: Optional[bool] = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageOut(ProductImageBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True
