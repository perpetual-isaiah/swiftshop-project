import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          SwiftShop
        </Link>

        <div className="navbar-links">
          <Link to="/products" className="navbar-link">
            Products
          </Link>

          {/* 🛒 Cart (always visible) */}
          <Link
            to="/cart"
            className="navbar-link"
            style={{ position: 'relative' }}
          >
            Cart 🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-12px',
                  background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                  color: 'white',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" className="navbar-link">
                My Orders
              </Link>
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
              <span className="navbar-link">
                Welcome, {user?.name}
              </span>
              <button onClick={handleLogout} className="navbar-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
