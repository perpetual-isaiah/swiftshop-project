import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="hero">
        <h1>Welcome to SwiftShop</h1>
        <p>Your one-stop microservices e-commerce platform</p>
        <div className="hero-buttons">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🛒</div>
          <h3>Easy Shopping</h3>
          <p>Browse and shop from our wide range of products with ease</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Secure Payments</h3>
          <p>Your transactions are safe with our secure payment system</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick and reliable delivery to your doorstep</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💎</div>
          <h3>Quality Products</h3>
          <p>Only the best products from trusted sellers</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '3rem', textAlign: 'center' }}>
        <h2>Built with Microservices</h2>
        <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
          SwiftShop is powered by multiple microservices working together:
        </p>
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <strong>User Service</strong>
            <p style={{ color: '#27ae60' }}>✓ Node.js</p>
          </div>
          <div>
            <strong>Product Service</strong>
            <p style={{ color: '#f39c12' }}>⏳ Python</p>
          </div>
          <div>
            <strong>Order Service</strong>
            <p style={{ color: '#f39c12' }}>⏳ Java</p>
          </div>
          <div>
            <strong>API Gateway</strong>
            <p style={{ color: '#27ae60' }}>✓ TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;