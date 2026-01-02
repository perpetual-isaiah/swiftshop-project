import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/productService';

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
      console.log('Loaded products:', data); // Debug log
      
      // Handle both array response and object with data property
      const productsArray = Array.isArray(data) ? data : (data.products || data.data || []);
      setProducts(productsArray);
    } catch (err) {
      console.error('Failed to load products:', err);
      
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
      console.log('Search results:', data); // Debug log
      
      // Handle both array response and object with data property
      const productsArray = Array.isArray(data) ? data : (data.products || data.data || []);
      setProducts(productsArray);
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
          <h2>🛍️ Products</h2>
          <p>Discover our amazing collection of products</p>
        </div>

        {/* Enhanced Search Bar */}
        <form onSubmit={handleSearch} className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="search-input"
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              position: 'absolute', 
              right: '5px', 
              top: '5px',
              padding: '0.8rem 2rem'
            }}
          >
            Search
          </button>
        </form>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {error && error.includes('not yet available') ? (
          // Coming soon message
          <div className="empty-state">
            <div className="empty-icon">🏗️</div>
            <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
              Product Service Coming Soon
            </h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              We're currently building the product catalog. Person 2 is working on implementing
              the Product Service with Python, PostgreSQL, and Elasticsearch.
            </p>
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
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>Try a different search term or browse all products</p>
            <button 
              onClick={loadProducts} 
              className="btn btn-primary"
              style={{ marginTop: '1.5rem' }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            {/* Product Count */}
            <div style={{ 
              marginBottom: '2rem', 
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                📊 {products.length} Product{products.length !== 1 ? 's' : ''} Available
              </span>
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); loadProducts(); }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: '#667eea',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textDecoration: 'underline'
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>

            {/* Enhanced Product Grid */}
            <div className="features">
              {products.map((product) => (
                <div key={product.id} className="product-card fade-in">
                  {/* Product Image */}
                  <div style={{ position: 'relative' }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div 
                        className="product-image"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '4rem'
                        }}
                      >
                        📦
                      </div>
                    )}
                    
                    {/* Stock Badge */}
                    {product.stock > 0 ? (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}>
                        {product.stock} in stock
                      </div>
                    ) : (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                        color: 'white',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}>
                        Out of Stock
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">
                      {product.description || 'No description available'}
                    </p>

                    {/* Product Footer */}
                    <div className="product-footer">
                      <div>
                        <div className="product-price">${product.price?.toFixed(2)}</div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.2rem' }}>
                          per unit
                        </div>
                      </div>
                      <button 
                        className="btn btn-primary"
                        disabled={product.stock === 0}
                        style={{ 
                          padding: '0.7rem 1.5rem',
                          fontSize: '0.9rem',
                          opacity: product.stock === 0 ? 0.5 : 1,
                          cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {product.stock === 0 ? '🚫 Unavailable' : '🛒 Add to Cart'}
                      </button>
                    </div>

                    {/* Product ID (for developers) */}
                    <div style={{ 
                      marginTop: '1rem', 
                      paddingTop: '1rem',
                      borderTop: '1px solid #f0f0f0',
                      fontSize: '0.75rem',
                      color: '#bdc3c7',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <span>ID: {product.id}</span>
                      <span>SKU: PRD-{product.id}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination placeholder */}
            {products.length > 12 && (
              <div style={{ 
                marginTop: '3rem', 
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '12px'
              }}>
                <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
                  Showing {products.length} products
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
                    Previous
                  </button>
                  <button className="btn btn-primary" style={{ padding: '0.6rem 1.2rem' }}>
                    1
                  </button>
                  <button className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem' }}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Developer Info Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>💡</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.8rem', color: '#2c3e50' }}>For Developers</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: '#667eea' }}>Service:</strong> Product Service
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Technology:</strong> Python (FastAPI)
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Database:</strong> SQLite
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Port:</strong> 5001
              </div>
            </div>
            <p style={{ color: '#7f8c8d', marginTop: '1rem', fontSize: '0.85rem' }}>
              Once the Product Service is deployed, this page will automatically display the product catalog with real-time data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;