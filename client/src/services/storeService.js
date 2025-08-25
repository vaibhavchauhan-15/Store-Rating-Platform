import api from './api';

export const storeService = {
  // Get all stores
  getAllStores: async () => {
    try {
      const response = await api.get('/api/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      // Return a consistent error response
      throw new Error(error.response?.data?.message || error.message || 'Failed to fetch stores');
    }
  },
  
  // Get store by ID
  getStoreById: async (id) => {
    const response = await api.get(`/api/stores/${id}`);
    return response.data;
  },
  
  // Create a new store (admin only)
  createStore: async (storeData) => {
    const response = await api.post('/api/stores', storeData);
    return response.data;
  },
  
  // Update a store
  updateStore: async (id, storeData) => {
    const response = await api.put(`/api/stores/${id}`, storeData);
    return response.data;
  },
  
  // Delete a store (admin only)
  deleteStore: async (id) => {
    const response = await api.delete(`/api/stores/${id}`);
    return response.data;
  },
  
  // Get stores for a specific owner
  getOwnerStores: async () => {
    const response = await api.get('/api/stores/owner');
    return response.data;
  },
  
  // Search stores by query
  searchStores: async (query) => {
    const response = await api.get(`/api/stores/search?q=${query}`);
    return response.data;
  },
  
  // Get store owner dashboard data
  getStoreOwnerDashboard: async () => {
    const response = await api.get('/api/stores/owner/dashboard');
    return response.data;
  }
};
