// src/services/orderService.js
import api from './api';

export const orderAPI = {
  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  getOrdersByUser: async (userId) => {
    const res = await api.get(`/orders/user/${userId}`);
    return res.data;
  },

  getOrderById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  payOrder: async (id) => {
    const res = await api.put(`/orders/${id}/pay`);
    return res.data;
  },

  getInvoice: async (id) => {
    const res = await api.get(`/orders/${id}/invoice`);
    return res.data;
  }
};

export default orderAPI;
