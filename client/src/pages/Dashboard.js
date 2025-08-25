import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaUser, FaStore, FaStar, FaEdit, FaLock, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/api/users/dashboard');
        setStats(res.data.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="custom-card mb-4">
        <div className="card-body">
          <h5 className="card-title d-flex align-items-center">
            <FaUser className="me-2 text-primary" /> Welcome, {currentUser?.name}
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">{currentUser?.email}</h6>
          <p className="card-text">
            <span className="badge bg-primary me-2">Role: {currentUser?.role}</span>
          </p>
          <div className="d-flex gap-2">
            <Link to="/profile" className="btn btn-primary">
              <FaEdit className="me-2" /> Edit Profile
            </Link>
            <Link to="/change-password" className="btn btn-secondary">
              <FaLock className="me-2" /> Change Password
            </Link>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="custom-card stat-card bg-primary text-white h-100">
            <div className="card-body">
              <FaStore className="stat-icon" />
              <h2 className="stat-value">{stats.totalStores}</h2>
              <p className="stat-label mb-0">Total Stores</p>
            </div>
            <div className="card-footer border-0 bg-transparent">
              <Link to="/stores" className="text-white text-decoration-none">
                View All Stores
              </Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="custom-card stat-card bg-success text-white h-100">
            <div className="card-body">
              <FaStar className="stat-icon" />
              <h2 className="stat-value">{stats.totalRatings}</h2>
              <p className="stat-label mb-0">Total Ratings</p>
            </div>
            <div className="card-footer border-0 bg-transparent">
              <span>Your Contribution</span>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-4">
          <div className="custom-card stat-card bg-info text-white h-100">
            <div className="card-body">
              <FaChartLine className="stat-icon" />
              <h2 className="stat-value">{typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : '0.0'}</h2>
              <p className="stat-label mb-0">Average Rating</p>
            </div>
            <div className="card-footer border-0 bg-transparent">
              <span>Overall Rating</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="custom-card">
        <div className="card-header">Recent Activity</div>
        <div className="card-body">
          <p>View and manage your recent store ratings and interactions.</p>
          <Link to="/stores" className="btn btn-primary">
            <FaStore className="me-2" /> Browse Stores
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
