import React, { useState, useEffect } from 'react';
import productAPI from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productAPI.getAllProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load products:', err);
      
      // Check if it's the 503 error (service not implemented)
      if (err.response?.status === 503) {
        setError('Product Service is not yet available. Person 2 is working on it!');
      } else {
        setError(err.response?.data?.message || 'Failed to load products');
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
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
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
          <h2>Products</h2>
          <p>Browse our collection</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {error && error.includes('not yet available') ? (
          // Show nice "coming soon" message
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🏗️</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
              Product Service Coming Soon
            </h2>
            <p style={{ color: '#7f8c8d', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              We're currently building the product catalog. Person 2 is working on implementing
              the Product Service with Python, PostgreSQL, and Elasticsearch.
            </p>
            <div style={{ marginTop: '3rem' }}>
              <div className="features">
                <div className="feature-card">
                  <div className="feature-icon">📦</div>
                  <h3>Product Catalog</h3>
                  <p>Browse thousands of products</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3>Smart Search</h3>
                  <p>Find exactly what you need</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🏷️</div>
                  <h3>Categories</h3>
                  <p>Organized and easy to navigate</p>
                </div>
              </div>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No products found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          // Product Grid (will display when Product Service is ready)
          <div className="features">
            {products.map((product) => (
              <div key={product.id} className="feature-card">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1rem',
                    }}
                  />
                )}
                <h3>{product.name}</h3>
                <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                  {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                    ${product.price?.toFixed(2)}
                  </span>
                  <button className="btn btn-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Developer Info */}
      <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f8f9fa' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 For Developers</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
          <strong>Status:</strong> Waiting for Product Service implementation
        </p>
        <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
          <strong>Owner:</strong> Person 2
        </p>
        <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
          <strong>Technology:</strong> Python (FastAPI) + PostgreSQL + Elasticsearch
        </p>
        <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '1rem' }}>
          Once the Product Service is deployed, this page will automatically display the product catalog.
        </p>
      </div>
    </div>
  );
};

export default Products;