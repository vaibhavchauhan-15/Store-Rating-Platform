import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminAddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, address, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/users', {
        name,
        email,
        password,
        address,
        role
      });
      
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New User</h2>
      
      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name *</label>
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
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
                <div className="form-text">
                  Password must be at least 6 characters long
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address *</label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={address}
                onChange={handleChange}
                rows="2"
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role *</label>
              <select
                className="form-select"
                id="role"
                name="role"
                value={role}
                onChange={handleChange}
                required
              >
                <option value="user">Regular User</option>
                <option value="store_owner">Store Owner</option>
                <option value="admin">Admin</option>
              </select>
              <div className="form-text">
                <ul className="mb-0 ps-3">
                  <li><strong>Regular User:</strong> Can browse stores and leave ratings</li>
                  <li><strong>Store Owner:</strong> Can manage their assigned stores</li>
                  <li><strong>Admin:</strong> Has full access to the system</li>
                </ul>
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/users')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddUser;
