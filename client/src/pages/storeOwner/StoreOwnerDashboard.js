import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { storeService } from '../../services/storeService';

const StoreOwnerDashboard = () => {
  const { currentUser } = useAuth();
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        console.log('Fetching store owner dashboard data...');
        console.log('Current user role:', currentUser?.role);
        
        // Fetch store owner dashboard stats
        const statsRes = await api.get('/api/users/owner-dashboard');
        console.log('Dashboard data received:', statsRes.data);
        
        const dashboardData = statsRes.data.data;
        
        // Set stores from the dashboard data
        setStores(dashboardData.stores || []);
        
        // Set dashboard stats
        setStats({
          totalStores: dashboardData.storeCount || 0,
          totalRatings: dashboardData.totalRatings || 0,
          averageRating: dashboardData.averageRating || 0
        });
      } catch (err) {
        console.error('Dashboard error:', err.response?.data || err);
        setError(`Failed to load dashboard data: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === 'store_owner') {
      fetchOwnerData();
    } else {
      setError('You must be a store owner to view this page');
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Store Owner Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Welcome, {currentUser?.name}</h5>
          <p className="card-text">You are managing {stats.totalStores} store(s)</p>
        </div>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4 mb-4">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Your Stores</h5>
              <p className="card-text display-4">{stats.totalStores}</p>
            </div>
            <div className="card-footer d-flex">
              <span>Total</span>
              <span className="ms-auto">
                <i className="fas fa-store"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Reviews</h5>
              <p className="card-text display-4">{stats.totalRatings}</p>
            </div>
            <div className="card-footer d-flex">
              <span>All Stores</span>
              <span className="ms-auto">
                <i className="fas fa-comment"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Average Rating</h5>
              <p className="card-text display-4">{typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : '0.0'}</p>
            </div>
            <div className="card-footer d-flex">
              <div>
                {Array.from({ length: 5 }).map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.round(stats.averageRating) ? 'text-warning' : 'text-white-50'}`}
                  ></i>
                ))}
              </div>
              <span className="ms-auto">
                <i className="fas fa-chart-line"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="mb-0">Your Stores</h5>
        </div>
        <div className="card-body">
          {stores.length === 0 ? (
            <div className="text-center p-4">
              <p className="mb-3">You don't have any stores assigned to you yet.</p>
              <p>An administrator will assign stores to your account.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Location</th>
                    <th>Average Rating</th>
                    <th>Total Reviews</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map(store => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.address || store.location}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {typeof store.averageRating === 'number' ? store.averageRating.toFixed(1) : '0.0'}
                          <div className="ms-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < Math.round(store.averageRating) ? 'text-warning' : 'text-secondary'} small`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{store.ratingCount || store.totalRatings || 0}</td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            to={`/stores/${store.id}`}
                            className="btn btn-sm btn-info"
                            title="View"
                          >
                            <i className="fas fa-eye"></i> View
                          </Link>
                          <Link 
                            to={`/store-owner/stores/edit/${store.id}`}
                            className="btn btn-sm btn-warning"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i> Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
