import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import orderAPI from '../services/orderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Assuming user has an id field
      const userId = user._id || user.id || 1; // Fallback to 1 for testing
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
      // Refresh orders
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process payment');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
        return '#27ae60';
      case 'CREATED':
        return '#f39c12';
      case 'CANCELLED':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

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
      <div className="card">
        <div className="card-header">
          <h2>My Orders</h2>
          <p>View and manage your order history</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here once you make a purchase.</p>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              <em>Note: Product service is not yet available. Check back soon!</em>
            </p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '1.5rem', color: '#7f8c8d' }}>
              You have {orders.length} order{orders.length !== 1 ? 's' : ''}
            </p>

            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>
                      Order #{order.id}
                    </h3>
                    <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
                      Placed: {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      backgroundColor: getStatusColor(order.status) + '20',
                      color: getStatusColor(order.status),
                      fontWeight: '600',
                    }}
                  >
                    {order.status}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '1rem', marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#7f8c8d' }}>Total Amount:</span>
                    <span style={{ fontWeight: '600', fontSize: '1.2rem', color: '#2c3e50' }}>
                      ${order.totalAmount?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#7f8c8d' }}>User ID:</span>
                    <span>{order.userId}</span>
                  </div>
                </div>

                {order.status === 'CREATED' && (
                  <button
                    onClick={() => handlePayOrder(order.id)}
                    className="btn btn-success"
                    style={{ marginTop: '1rem', width: '100%' }}
                  >
                    Pay Now (${order.totalAmount?.toFixed(2)})
                  </button>
                )}

                {order.status === 'PAID' && (
                  <div
                    style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      backgroundColor: '#d4edda',
                      color: '#155724',
                      borderRadius: '4px',
                      textAlign: 'center',
                    }}
                  >
                    ✓ Payment completed successfully
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Test Order Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>💡 Developer Note</h3>
        <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
          This page shows orders from the Order Service. Since the Product Service isn't ready yet,
          you can test order functionality by creating test orders manually.
        </p>
        <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
          Once Person 2 completes the Product Service, you'll be able to create orders from actual products.
        </p>
      </div>
    </div>
  );
};

export default Orders;