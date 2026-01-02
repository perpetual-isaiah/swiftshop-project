import requests

BASE_URL = "http://localhost:5001/api/products/"

products = [
    {
        "name": "MacBook Pro 16-inch",
        "description": "M3 Max chip, 64GB RAM, 2TB SSD - Perfect for professionals",
        "price": 3499.99,
        "stock": 15
    },
    {
        "name": "iPhone 15 Pro",
        "description": "Latest iPhone with A17 Pro chip, Titanium design, USB-C",
        "price": 999.99,
        "stock": 50
    },
    {
        "name": "AirPods Pro (2nd generation)",
        "description": "Active noise cancellation, Adaptive Audio, USB-C charging",
        "price": 249.99,
        "stock": 100
    },
    {
        "name": "iPad Air M2",
        "description": "11-inch Liquid Retina display, M2 chip, 256GB",
        "price": 749.99,
        "stock": 30
    },
    {
        "name": "Apple Watch Series 9",
        "description": "GPS + Cellular, 45mm, Always-On Retina display",
        "price": 499.99,
        "stock": 40
    },
    {
        "name": "Magic Keyboard",
        "description": "Wireless, rechargeable keyboard with numeric keypad",
        "price": 129.99,
        "stock": 75
    },
    {
        "name": "Magic Mouse",
        "description": "Wireless, rechargeable, Multi-Touch surface",
        "price": 79.99,
        "stock": 80
    },
    {
        "name": "AirTag 4-pack",
        "description": "Keep track of your items with precision finding",
        "price": 99.99,
        "stock": 150
    },
    {
        "name": "Samsung Galaxy S24 Ultra",
        "description": "Latest Android flagship, 512GB, AI features",
        "price": 1299.99,
        "stock": 25
    },
    {
        "name": "Sony WH-1000XM5",
        "description": "Industry-leading noise canceling headphones",
        "price": 399.99,
        "stock": 60
    }
]

print("🛍️ Adding sample products...\n")

for i, product in enumerate(products, 1):
    try:
        response = requests.post(BASE_URL, json=product)
        if response.status_code in (200, 201):
            print(f"✅ {i}. Added: {product['name']} - ${product['price']}")
        else:
            print(f"❌ {i}. Failed ({response.status_code}): {response.text}")
    except Exception as e:
        print(f"❌ {i}. Error: {e}")

print("\n✨ Done! Verifying products...\n")

response = requests.get(BASE_URL)
response.raise_for_status()
products = response.json()
print(f"📦 Total products in database: {len(products)}")
