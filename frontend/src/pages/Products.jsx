import React, { useState, useEffect } from "react";
import { productAPI } from "../services/productService";
import { useCart } from "../context/CartContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { addToCart } = useCart(); // ✅ cart hook

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productAPI.getAllProducts();

      const productsArray = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(productsArray);
    } catch (err) {
      if (err.response?.status === 503) {
        setError("Product Service is not yet available.");
      } else {
        setError("Failed to load products");
      }
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);
      const data = await productAPI.searchProducts(searchQuery);
      const productsArray = Array.isArray(data)
        ? data
        : data.products || data.data || [];
      setProducts(productsArray);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || null,
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>🛍️ Products</h2>
          <p>Discover our amazing collection</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ position: "absolute", right: "5px", top: "5px" }}
          >
            Search
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <button onClick={loadProducts} className="btn btn-primary">
              Reload
            </button>
          </div>
        ) : (
          <div className="features">
            {products.map((product) => (
              <div key={product.id} className="product-card fade-in">
                {/* Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image" style={{ textAlign: "center", fontSize: "4rem" }}>
                    📦
                  </div>
                )}

                {/* Info */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">
                    {product.description || "No description"}
                  </p>

                  <div className="product-footer">
                    <div>
                      <div className="product-price">
                        ${product.price?.toFixed(2)}
                      </div>
                    </div>

                    <button
                      className="btn btn-primary"
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                    >
                      {product.stock === 0 ? "🚫 Unavailable" : "🛒 Add to Cart"}
                    </button>
                  </div>

                  <div
                    style={{
                      marginTop: "1rem",
                      fontSize: "0.75rem",
                      color: "#bdc3c7",
                    }}
                  >
                    ID: {product.id}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
