"""
Seed script to populate the database with products from Home.jsx
Works with both PostgreSQL (Docker) and SQLite (local development)
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.db.database import SessionLocal, engine, Base
from app.models.product import Product

# Create tables if they don't exist
print("🔧 Creating database tables...")
Base.metadata.create_all(bind=engine)

# Product data matching Home.jsx exactly
products_data = [
    # First Row - Premium Products
    {
        "name": "iPhone 13 Pro",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 1000.00,
        "stock": 50,
        "category": "Smartphones",
        "image_url": "/images/p6.png"
    },
    {
        "name": "AirPods",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 100.00,
        "stock": 100,
        "category": "Audio",
        "image_url": "/images/a1.png"
    },
    {
        "name": "Laptop",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 200.00,
        "stock": 30,
        "category": "Computers",
        "image_url": "/images/laptop2.png"
    },
    {
        "name": "iPad",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 300.00,
        "stock": 40,
        "category": "Tablets",
        "image_url": "/images/t1.png"
    },
    
    # Second Row - Accessories & Monitors
    {
        "name": "Smart Watch",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 50.60,
        "stock": 80,
        "category": "Wearables",
        "image_url": "/images/w1.png"
    },
    {
        "name": "PC Monitor",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 600.00,
        "stock": 25,
        "category": "Monitors",
        "image_url": "/images/pcm1.png"
    },
    {
        "name": "iPhone X",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 500.00,
        "stock": 45,
        "category": "Smartphones",
        "image_url": "/images/phone1.png"
    },
    {
        "name": "Headphone",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 60.00,
        "stock": 70,
        "category": "Audio",
        "image_url": "/images/h1.png"
    },
    
    # Third Row - Home Appliances
    {
        "name": "Washing Machine",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 100.50,
        "stock": 20,
        "category": "Home Appliances",
        "image_url": "/images/pr1.png"
    },
    {
        "name": "AC",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 500.00,
        "stock": 15,
        "category": "Home Appliances",
        "image_url": "/images/pr2.png"
    },
    {
        "name": "Microwave Oven",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 200.30,
        "stock": 30,
        "category": "Home Appliances",
        "image_url": "/images/pr3.png"
    },
    {
        "name": "Fridge",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 300.00,
        "stock": 18,
        "category": "Home Appliances",
        "image_url": "/images/pr4.png"
    },
    
    # Fourth Row - Gaming & Electronics
    {
        "name": "Fan",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 50.60,
        "stock": 60,
        "category": "Home Appliances",
        "image_url": "/images/pr5.png"
    },
    {
        "name": "Fridge (Large)",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 1500.00,
        "stock": 10,
        "category": "Home Appliances",
        "image_url": "/images/pr6.png"
    },
    {
        "name": "Gaming PC",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 500.60,
        "stock": 12,
        "category": "Gaming",
        "image_url": "/images/pr7.png"
    },
    {
        "name": "Monitor",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 250.00,
        "stock": 35,
        "category": "Monitors",
        "image_url": "/images/pr8.png"
    },
    
    # Fifth Row - Gaming Accessories
    {
        "name": "Smart Watch (Sport)",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 30.20,
        "stock": 90,
        "category": "Wearables",
        "image_url": "/images/pr9.png"
    },
    {
        "name": "Power Bank",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 100.50,
        "stock": 100,
        "category": "Accessories",
        "image_url": "/images/pr10.png"
    },
    {
        "name": "Gaming Mouse",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 30.00,
        "stock": 120,
        "category": "Gaming",
        "image_url": "/images/pr11.png"
    },
    {
        "name": "Joysticks",
        "description": "High-quality performance with a modern design — perfect for daily use.",
        "price": 150.00,
        "stock": 40,
        "category": "Gaming",
        "image_url": "/images/pr12.png"
    },
]

def seed_database():
    db = SessionLocal()
    
    try:
        # Check if products already exist
        existing_count = db.query(Product).count()
        if existing_count > 0:
            print(f"⚠️  Database already contains {existing_count} products.")
            response = input("Do you want to clear and reseed? (yes/no): ").lower()
            if response != 'yes':
                print("❌ Seeding cancelled.")
                return
            
            # Clear existing products
            print("🗑️  Clearing existing products...")
            db.query(Product).delete()
            db.commit()
        
        # Add all products
        print("📦 Adding products to database...")
        for product_data in products_data:
            product = Product(**product_data)
            db.add(product)
            print(f"  ✅ Added: {product_data['name']} - ${product_data['price']}")
        
        db.commit()
        print(f"\n✨ Successfully seeded {len(products_data)} products!")
        
        # Show category summary
        categories = db.query(Product.category).distinct().all()
        print(f"\n📊 Categories created: {', '.join([cat[0] for cat in categories])}")
        
        # Show database info
        db_url = os.getenv('DATABASE_URL', 'sqlite:///./sqlite.db')
        if 'postgresql' in db_url:
            print(f"\n🐘 Database: PostgreSQL")
        else:
            print(f"\n💾 Database: SQLite")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🌱 SWIFTSHOP DATABASE SEEDING")
    print("="*60 + "\n")
    
    try:
        seed_database()
        print("\n" + "="*60)
        print("✅ SEEDING COMPLETE!")
        print("="*60 + "\n")
    except KeyboardInterrupt:
        print("\n\n⚠️  Seeding interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Seeding failed: {e}")
        sys.exit(1)