import api from './api';

export const ratingService = {
  // Get all ratings for a store
  getStoreRatings: async (storeId) => {
    const response = await api.get(`/api/ratings/store/${storeId}`);
    return response.data;
  },
  
  // Get user's rating for a specific store
  getUserRating: async (storeId) => {
    const response = await api.get(`/api/ratings/user/store/${storeId}`);
    return response.data;
  },
  
  // Create a new rating
  createRating: async (ratingData) => {
    const response = await api.post('/api/ratings', ratingData);
    return response.data;
  },
  
  // Update an existing rating
  updateRating: async (ratingId, ratingData) => {
    const response = await api.put(`/api/ratings/${ratingId}`, ratingData);
    return response.data;
  },
  
  // Delete a rating
  deleteRating: async (ratingId) => {
    const response = await api.delete(`/api/ratings/${ratingId}`);
    return response.data;
  },
  
  // Get all ratings submitted by the current user
  getUserRatings: async () => {
    const response = await api.get('/api/ratings/user');
    return response.data;
  },
  
  // Get rating statistics (admin only)
  getRatingStats: async () => {
    const response = await api.get('/api/ratings/stats');
    return response.data;
  }
};
