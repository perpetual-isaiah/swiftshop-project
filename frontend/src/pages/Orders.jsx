import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderAPI from '../services/orderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, created, paid, cancelled

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userId = user._id || user.id || 1;
      const data = await orderAPI.getOrdersByUserId(userId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      await orderAPI.payOrder(orderId);
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process payment');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return '#11998e';
      case 'CREATED':
        return '#f39c12';
      case 'CANCELLED':
        return '#eb3349';
      default:
        return '#7f8c8d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return '✅';
      case 'CREATED':
        return '⏳';
      case 'CANCELLED':
        return '❌';
      default:
        return '📦';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status?.toUpperCase() === filter.toUpperCase();
  });

  const totalSpent = orders
    .filter(o => o.status === 'PAID')
    .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Order Statistics */}
      {orders.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2c3e50' }}>
              {orders.length}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
              Total Orders
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#11998e' }}>
              {orders.filter(o => o.status === 'PAID').length}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
              Completed
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏳</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f39c12' }}>
              {orders.filter(o => o.status === 'CREATED').length}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
              Pending
            </div>
          </div>

          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#667eea' }}>
              ${totalSpent.toFixed(2)}
            </div>
            <div style={{ color: '#7f8c8d', fontSize: '0.9rem', fontWeight: '600' }}>
              Total Spent
            </div>
          </div>
        </div>
      )}

      {/* Main Orders Card */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>🛍️ My Orders</h2>
            <p>Track and manage your order history</p>
          </div>
          {orders.length > 0 && (
            <button 
              onClick={loadOrders} 
              style={{ 
                background: 'none', 
                border: '2px solid #667eea', 
                color: '#667eea',
                padding: '0.6rem 1.2rem',
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
              🔄 Refresh
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p style={{ marginBottom: '2rem' }}>
              Your order history will appear here once you make a purchase.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/products'}
            >
              🛍️ Start Shopping
            </button>
            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#95a5a6' }}>
              <em>Note: Product service is currently in development</em>
            </p>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginBottom: '2rem',
              padding: '0.5rem',
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '12px',
              flexWrap: 'wrap'
            }}>
              {['all', 'created', 'paid', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s',
                    background: filter === status 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: filter === status ? 'white' : '#2c3e50'
                  }}
                >
                  {status === 'all' ? `All (${orders.length})` : `${status} (${orders.filter(o => o.status?.toUpperCase() === status.toUpperCase()).length})`}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
                <p>No orders found with status: <strong>{filter}</strong></p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="order-card fade-in"
                    style={{
                      borderLeft: `4px solid ${getStatusColor(order.status)}`
                    }}
                  >
                    {/* Order Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'start', 
                      marginBottom: '1.5rem',
                      paddingBottom: '1rem',
                      borderBottom: '2px solid #f0f0f0'
                    }}>
                      <div>
                        <h3 style={{ 
                          margin: 0, 
                          marginBottom: '0.5rem',
                          fontSize: '1.4rem',
                          color: '#2c3e50'
                        }}>
                          Order #{order.id}
                        </h3>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#7f8c8d' }}>
                          <span>📅 {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span>🕐 {new Date(order.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <div className={`status-badge status-${order.status?.toLowerCase()}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '1.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '0.3rem', fontWeight: '600' }}>
                          ORDER TOTAL
                        </div>
                        <div style={{ fontSize: '1.8rem', fontWeight: '800', color: getStatusColor(order.status) }}>
                          ${order.totalAmount?.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '0.3rem', fontWeight: '600' }}>
                          USER ID
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50' }}>
                          #{order.userId}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginBottom: '0.3rem', fontWeight: '600' }}>
                          ORDER STATUS
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: getStatusColor(order.status) }}>
                          {getStatusIcon(order.status)} {order.status}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {order.status === 'CREATED' && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '1rem', 
                        paddingTop: '1rem',
                        borderTop: '2px solid #f0f0f0'
                      }}>
                        <button
                          onClick={() => handlePayOrder(order.id)}
                          className="btn btn-success"
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                          💳 Pay Now - ${order.totalAmount?.toFixed(2)}
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.9rem 1.5rem' }}
                          title="View Details"
                        >
                          👁️
                        </button>
                      </div>
                    )}

                    {order.status === 'PAID' && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid rgba(17, 153, 142, 0.2)'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>✅</span>
                        <strong style={{ marginLeft: '0.5rem', color: '#11998e' }}>
                          Payment Completed Successfully
                        </strong>
                      </div>
                    )}

                    {order.status === 'CANCELLED' && (
                      <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'linear-gradient(135deg, rgba(235, 51, 73, 0.1) 0%, rgba(244, 92, 67, 0.1) 100%)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        border: '2px solid rgba(235, 51, 73, 0.2)'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>❌</span>
                        <strong style={{ marginLeft: '0.5rem', color: '#eb3349' }}>
                          Order Cancelled
                        </strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Developer Note */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>💡</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.8rem', color: '#2c3e50' }}>Developer Information</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
              This page displays orders from the Order Service. Once the Product Service is ready,
              you'll be able to create orders from actual products with a shopping cart.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: '#667eea' }}>Service:</strong> Order Service
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Technology:</strong> Java (Spring Boot)
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Database:</strong> H2 (In-Memory)
              </div>
              <div>
                <strong style={{ color: '#667eea' }}>Port:</strong> 8082
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;