"""
Verification script to check if everything is set up correctly
Tests both direct product service (port 5001) and API Gateway (port 8000)
"""

import requests
import json
import sys

def print_header(text):
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70 + "\n")

def print_subheader(text):
    print("\n" + "-"*70)
    print(f"  {text}")
    print("-"*70 + "\n")

def test_service(base_url, service_name):
    """Test a service with all endpoints"""
    
    print_subheader(f"Testing {service_name}")
    
    # 1. Health Check
    print(f"1️⃣  Health Check...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            print(f"   ✅ {service_name} is running")
            print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}")
        else:
            print(f"   ⚠️  Unexpected status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Cannot connect to {service_name}")
        print(f"   Error: {str(e)[:100]}")
        return False
    
    # 2. Get All Products
    print(f"\n2️⃣  Get All Products...")
    try:
        response = requests.get(f"{base_url}/api/products", timeout=5)
        if response.status_code == 200:
            products = response.json()
            print(f"   ✅ Fetched {len(products)} products")
            
            if len(products) > 0:
                print("\n   Sample products:")
                for i, product in enumerate(products[:3], 1):
                    print(f"   {i}. {product['name']} - ${product['price']} ({product.get('category', 'N/A')})")
                
                if len(products) >= 20:
                    print(f"\n   ✅ All 20 expected products are present")
                else:
                    print(f"\n   ⚠️  Expected 20 products, found {len(products)}")
            else:
                print("   ⚠️  No products found. Run seed_products.py to add products.")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error: {str(e)[:100]}")
    
    # 3. Get Categories
    print(f"\n3️⃣  Get Categories...")
    try:
        response = requests.get(f"{base_url}/api/products/categories", timeout=5)
        if response.status_code == 200:
            data = response.json()
            categories = data.get('categories', [])
            print(f"   ✅ Fetched {len(categories)} categories")
            if categories:
                print(f"   Categories: {', '.join(categories)}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error: {str(e)[:100]}")
    
    # 4. Filter by Category
    print(f"\n4️⃣  Filter by Category...")
    test_category = "Smartphones"
    try:
        response = requests.get(
            f"{base_url}/api/products",
            params={"category": test_category},
            timeout=5
        )
        if response.status_code == 200:
            products = response.json()
            print(f"   ✅ {test_category}: {len(products)} products")
            for product in products[:3]:
                print(f"   - {product['name']}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error: {str(e)[:100]}")
    
    # 5. Get Single Product
    print(f"\n5️⃣  Get Single Product...")
    try:
        response = requests.get(f"{base_url}/api/products/1", timeout=5)
        if response.status_code == 200:
            product = response.json()
            print("   ✅ Successfully fetched product #1")
            print(f"   - Name: {product['name']}")
            print(f"   - Price: ${product['price']}")
            print(f"   - Category: {product.get('category', 'N/A')}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error: {str(e)[:100]}")
    
    return True

def check_docker_services():
    """Check if Docker services are running"""
    print_header("DOCKER SERVICES CHECK")
    
    services = {
        "Product Service": "http://localhost:5001",
        "API Gateway": "http://localhost:8000",
        "Frontend": "http://localhost:3000"
    }
    
    results = {}
    for name, url in services.items():
        try:
            response = requests.get(url, timeout=3)
            results[name] = "✅ Running"
            print(f"   {name:20s} → {results[name]}")
        except requests.exceptions.RequestException:
            results[name] = "❌ Not accessible"
            print(f"   {name:20s} → {results[name]}")
    
    return results

def check_required_images():
    print_header("REQUIRED IMAGES CHECK")
    
    required_images = [
        "p6.png", "a1.png", "laptop2.png", "t1.png",
        "w1.png", "pcm1.png", "phone1.png", "h1.png",
        "pr1.png", "pr2.png", "pr3.png", "pr4.png",
        "pr5.png", "pr6.png", "pr7.png", "pr8.png",
        "pr9.png", "pr10.png", "pr11.png", "pr12.png",
        "c1.png", "c2.png", "c3.png", "c4.png", "c5.png",
        "background.png", "image1.png", "arrow.png"
    ]
    
    print("ℹ️  The following images should be in frontend/public/images/:")
    print()
    
    for i, img in enumerate(required_images, 1):
        if i % 4 == 1:
            print("   ", end="")
        print(f"{img:20s}", end="")
        if i % 4 == 0 or i == len(required_images):
            print()
    
    print(f"\n   Total images needed: {len(required_images)}")

def main():
    print("\n" + "╔" + "="*68 + "╗")
    print("║" + " "*18 + "SWIFTSHOP SETUP VERIFICATION" + " "*22 + "║")
    print("╚" + "="*68 + "╝")
    
    # Check Docker services
    service_status = check_docker_services()
    
    # Test Product Service (direct)
    print_header("PRODUCT SERVICE (Direct - Port 5001)")
    product_service_ok = test_service("http://localhost:5001", "Product Service")
    
    # Test API Gateway
    print_header("API GATEWAY (Port 8000)")
    gateway_ok = test_service("http://localhost:8000", "API Gateway")
    
    # Check required images
    check_required_images()
    
    # Final Summary
    print_header("VERIFICATION SUMMARY")
    
    all_ok = True
    
    if product_service_ok:
        print("   ✅ Product Service is working correctly")
    else:
        print("   ❌ Product Service has issues")
        all_ok = False
    
    if gateway_ok:
        print("   ✅ API Gateway is working correctly")
    else:
        print("   ❌ API Gateway has issues")
        all_ok = False
    
    print("\n" + "-"*70)
    
    if all_ok:
        print("\n   🎉 ALL TESTS PASSED!")
        print("\n   Next steps:")
        print("   1. ✅ Backend is ready")
        print("   2. ✅ API Gateway is routing correctly")
        print("   3. Ensure images are in frontend/public/images/")
        print("   4. Frontend should use: http://localhost:8000")
        print()
        return 0
    else:
        print("\n   ⚠️  SOME TESTS FAILED")
        print("\n   Troubleshooting:")
        print("   1. Make sure Docker containers are running:")
        print("      docker-compose ps")
        print("   2. Check container logs:")
        print("      docker-compose logs product-service")
        print("      docker-compose logs api-gateway")
        print("   3. Run seed script if no products found:")
        print("      docker-compose exec product-service python seed_products.py")
        print()
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Verification interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)