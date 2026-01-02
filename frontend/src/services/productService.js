import api from './api';

// Product APIs
export const productAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
  // Get all products and filter on client side
  const response = await api.get('/products');
  const products = response.data;
  
  if (!query) {
    return products;
  }
  
  // Filter products by name or description
  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(query.toLowerCase()))
  );
  
  return filtered;
},

  // Create product (admin only - for future)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product (admin only - for future)
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Delete product (admin only - for future)
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

export default productAPI;
