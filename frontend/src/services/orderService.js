import api from './api';

// Order APIs
export const orderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get all orders for a user
  getOrdersByUserId: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Pay for an order
  payOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/pay`);
    return response.data;
  },
};

export default orderAPI;