import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0,
    usersByRole: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/api/users/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load admin statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-4">
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Users</h6>
                  <h2 className="mb-0">{stats.totalUsers}</h2>
                </div>
                <i className="fas fa-users fa-3x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <Link to="/admin/users" className="text-white">View Users</Link>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Stores</h6>
                  <h2 className="mb-0">{stats.totalStores}</h2>
                </div>
                <i className="fas fa-store fa-3x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <Link to="/admin/stores" className="text-white">View Stores</Link>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-info h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Ratings</h6>
                  <h2 className="mb-0">{stats.totalRatings}</h2>
                </div>
                <i className="fas fa-star fa-3x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <span className="text-white">All Reviews</span>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Average Rating</h6>
                  <h2 className="mb-0">{typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : '0.0'}</h2>
                </div>
                <i className="fas fa-chart-line fa-3x opacity-50"></i>
              </div>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
              <span className="text-white">Store Performance</span>
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Users by Role</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                      <tr key={role}>
                        <td>{role.charAt(0).toUpperCase() + role.slice(1)}</td>
                        <td>{count}</td>
                        <td>
                          {((count / stats.totalUsers) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/admin/add-user" className="btn btn-primary">
                  <i className="fas fa-user-plus me-2"></i> Add New User
                </Link>
                <Link to="/admin/add-store" className="btn btn-success">
                  <i className="fas fa-store-alt me-2"></i> Add New Store
                </Link>
                <Link to="/admin/users" className="btn btn-info">
                  <i className="fas fa-users-cog me-2"></i> Manage Users
                </Link>
                <Link to="/admin/stores" className="btn btn-warning">
                  <i className="fas fa-edit me-2"></i> Manage Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
