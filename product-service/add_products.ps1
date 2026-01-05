# PowerShell script to add sample products to SwiftShop

Write-Host "🛍️ Adding sample products to SwiftShop..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5001/api/products/"

$products = @(
    @{
        name = "MacBook Pro 16-inch"
        description = "M3 Max chip, 64GB RAM, 2TB SSD - Perfect for professionals"
        price = 3499.99
        stock = 15
    },
    @{
        name = "iPhone 15 Pro"
        description = "Latest iPhone with A17 Pro chip, Titanium design, USB-C"
        price = 999.99
        stock = 50
    },
    @{
        name = "AirPods Pro (2nd generation)"
        description = "Active noise cancellation, Adaptive Audio, USB-C charging"
        price = 249.99
        stock = 100
    },
    @{
        name = "iPad Air M2"
        description = "11-inch Liquid Retina display, M2 chip, 256GB"
        price = 749.99
        stock = 30
    },
    @{
        name = "Apple Watch Series 9"
        description = "GPS + Cellular, 45mm, Always-On Retina display"
        price = 499.99
        stock = 40
    },
    @{
        name = "Magic Keyboard"
        description = "Wireless, rechargeable keyboard with numeric keypad"
        price = 129.99
        stock = 75
    },
    @{
        name = "Magic Mouse"
        description = "Wireless, rechargeable, Multi-Touch surface"
        price = 79.99
        stock = 80
    },
    @{
        name = "AirTag 4-pack"
        description = "Keep track of your items with precision finding"
        price = 99.99
        stock = 150
    },
    @{
        name = "Samsung Galaxy S24 Ultra"
        description = "Latest Android flagship, 512GB, AI features"
        price = 1299.99
        stock = 25
    },
    @{
        name = "Sony WH-1000XM5"
        description = "Industry-leading noise canceling headphones"
        price = 399.99
        stock = 60
    }
)

$count = 0
foreach ($product in $products) {
    $count++
    try {
        $json = $product | ConvertTo-Json
        Invoke-RestMethod -Uri $baseUrl -Method Post -Body $json -ContentType "application/json" -ErrorAction Stop
        Write-Host ("✅ {0}. Added: {1} - ${2}" -f $count, $product.name, $product.price) -ForegroundColor Green

    }
    catch {
        Write-Host "❌ $count. Failed to add $($product.name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✨ Done! Verifying products..." -ForegroundColor Cyan
Write-Host ""

try {
    $allProducts = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "📦 Total products in database: $($allProducts.Count)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Products:" -ForegroundColor Yellow
    foreach ($p in $allProducts) {
        Write-Host "  • $($p.name) - `$$($p.price) (Stock: $($p.stock))" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ Failed to verify products: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Product Service is ready!" -ForegroundColor Green
Write-Host "🌐 Access the products at: http://localhost:3000/products" -ForegroundColor Cyan