import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const UserProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }, [currentUser]);

  const { name, email } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return setError('Name is required');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile({ name });
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">My Profile</h2>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Edit Profile</h5>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    disabled
                  />
                  <div className="form-text">
                    Email cannot be changed
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Account Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3 d-flex align-items-center justify-content-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px', fontSize: '2rem' }}>
                  {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-muted small">Role</div>
                <div className="fw-bold">
                  {currentUser?.role === 'admin' ? 'Administrator' :
                   currentUser?.role === 'storeOwner' ? 'Store Owner' :
                   'Regular User'}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-muted small">Member Since</div>
                <div className="fw-bold">
                  {currentUser?.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
              
              <div className="d-grid gap-2">
                <a href="/change-password" className="btn btn-outline-primary">
                  Change Password
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
