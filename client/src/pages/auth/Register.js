import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaMapMarkerAlt } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const { name, email, password, confirmPassword, address } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      return setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
    }
    
    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return setError('Name must be between 20 and 60 characters');
    }
    
    setLoading(true);
    
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        address
      });
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="custom-card">
        <div className="card-header">
          <h4 className="mb-0 d-flex align-items-center">
            <FaUserPlus className="me-2" /> Create an Account
          </h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label d-flex align-items-center">
                <FaUser className="me-2" /> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                minLength="20"
                maxLength="60"
              />
              <div className="form-text">
                Name must be between 20 and 60 characters
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label d-flex align-items-center">
                <FaEnvelope className="me-2" /> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" /> Address
              </label>
              <textarea
                className="form-control"
                id="address"
                name="address"
                value={address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
                maxLength="400"
                rows="3"
              ></textarea>
              <div className="form-text">
                Address cannot exceed 400 characters
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label d-flex align-items-center">
                <FaLock className="me-2" /> Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="8"
                maxLength="16"
                pattern="(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}"
              />
              <div className="form-text">
                Password must be 8-16 characters with at least one uppercase letter and one special character
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label d-flex align-items-center">
                <FaLock className="me-2" /> Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="8"
                maxLength="16"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" /> Register
                </>
              )}
            </button>
          </form>
          <div className="mt-3 text-center">
            <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
