import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await updateUser({ name, email });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Calculate days since account creation
  const daysSinceJoined = Math.floor(
    (new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '2.5rem' }}>
              Welcome back, {user.name}! 👋
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '1.1rem' }}>
              Here's what's happening with your account today
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Member for</div>
            <div style={{ fontSize: '2rem', fontWeight: '800' }}>
              {daysSinceJoined} {daysSinceJoined === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Profile Completion */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
          }}>
            👤
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2c3e50', marginBottom: '0.3rem' }}>
            100%
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
            Profile Complete
          </div>
        </div>

        {/* Orders */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 10px 30px rgba(17, 153, 142, 0.3)'
          }}>
            🛒
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2c3e50', marginBottom: '0.3rem' }}>
            0
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
            Orders Placed
          </div>
        </div>

        {/* Total Spent */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)'
          }}>
            💰
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2c3e50', marginBottom: '0.3rem' }}>
            $0.00
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
            Total Spent
          </div>
        </div>

        {/* Account Status */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            margin: '0 auto 1rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)'
          }}>
            ✨
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2c3e50', marginBottom: '0.3rem' }}>
            Active
          </div>
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
            Account Status
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
              📋 Profile Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'none',
                  border: '2px solid #667eea',
                  color: '#667eea',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#667eea';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#667eea';
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {!isEditing ? (
            <div>
              <div className="info-item">
                <span className="info-label">👤 Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📧 Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">🎭 Role</span>
                <span className="info-value" style={{ 
                  textTransform: 'capitalize',
                  padding: '0.3rem 0.8rem',
                  background: user.role === 'admin' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                  color: 'white',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {user.role}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">📅 Member Since</span>
                <span className="info-value">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">🔄 Last Updated</span>
                <span className="info-value">
                  {new Date(user.updatedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  {loading ? '⏳ Saving...' : '✅ Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={loading}
                  style={{ flex: 1 }}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Activity & Quick Actions */}
        <div>
          {/* Recent Activity */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#2c3e50' }}>
              📊 Recent Activity
            </h3>
            <div style={{ 
              padding: '2rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📈</div>
              <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>No recent activity</p>
              <p style={{ fontSize: '0.85rem', color: '#95a5a6' }}>
                Start shopping to see your activity here!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: '#2c3e50' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.href = '/products'}
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                🛍️ Browse Products
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.location.href = '/orders'}
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                📦 View Orders
              </button>
              <button 
                className="btn btn-secondary"
                disabled
                style={{ 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }}
              >
                💳 Payment Methods (Soon)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="features" style={{ marginTop: '2rem' }}>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Track Orders</h3>
          <p>Monitor your order status in real-time and get updates on delivery</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Save Favorites</h3>
          <p>Keep track of your favorite products for quick access later</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎁</div>
          <h3>Exclusive Deals</h3>
          <p>Get access to member-only discounts and special offers</p>
        </div>
      </div>

      {/* System Status */}
      <div className="card" style={{ 
        marginTop: '2rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: '#2c3e50' }}>
          🔧 System Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 0 10px rgba(17, 153, 142, 0.5)'
            }}></div>
            <div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>User Service</div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>✅ Operational</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 0 10px rgba(17, 153, 142, 0.5)'
            }}></div>
            <div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>Product Service</div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>✅ Operational</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 0 10px rgba(17, 153, 142, 0.5)'
            }}></div>
            <div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>Order Service</div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>✅ Operational</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              boxShadow: '0 0 10px rgba(17, 153, 142, 0.5)'
            }}></div>
            <div>
              <div style={{ fontWeight: '600', color: '#2c3e50' }}>API Gateway</div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>✅ Operational</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;