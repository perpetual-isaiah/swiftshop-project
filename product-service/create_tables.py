from app.db.database import Base, engine
from app.models.product import Product  # noqa: F401

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Done.")

