import React, { useEffect, useState } from 'react';
import orderAPI from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth(); // must contain user.id or user._id
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getOrdersByUser(userId);
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (orderId) => {
    try {
      await orderAPI.payOrder(orderId);
      loadOrders(); // refresh list
    } catch (err) {
      alert('Payment failed');
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="card">
      <h2>📦 My Orders</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>${order.totalAmount}</td>
                <td>
                  <span className={`badge ${order.status === 'PAID' ? 'success' : 'warning'}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {order.status === 'CREATED' ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => handlePay(order.id)}
                    >
                      Pay Now
                    </button>
                  ) : (
                    <span>✅ Paid</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
