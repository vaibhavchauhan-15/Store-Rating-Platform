import api from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/api/users');
    return response.data;
  },
  
  // Get user by ID (admin only)
  getUserById: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  },
  
  // Create a new user (admin only)
  createUser: async (userData) => {
    const response = await api.post('/api/users', userData);
    return response.data;
  },
  
  // Update a user
  updateUser: async (id, userData) => {
    const response = await api.put(`/api/users/${id}`, userData);
    return response.data;
  },
  
  // Delete a user (admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
  },
  
  // Update current user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  },
  
  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/api/users/change-password', passwordData);
    return response.data;
  },
  
  // Get admin dashboard data
  getAdminDashboard: async () => {
    const response = await api.get('/api/users/admin/dashboard');
    return response.data;
  },
  
  // Get user dashboard data
  getUserDashboard: async () => {
    const response = await api.get('/api/users/dashboard');
    return response.data;
  },
  
  // Get store owner dashboard data
  getOwnerDashboard: async () => {
    const response = await api.get('/api/users/owner-dashboard');
    return response.data;
  }
};
