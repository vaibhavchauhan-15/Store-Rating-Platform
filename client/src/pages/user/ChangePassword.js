import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FaLock, FaKey, FaCheck, FaUndo } from 'react-icons/fa';

const ChangePassword = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }
    
    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      return setError('Password must be 8-16 characters with at least one uppercase letter and one special character');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.put('/api/users/password', {
        currentPassword,
        newPassword
      });
      
      setSuccess('Password changed successfully');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 d-flex align-items-center">
        <FaKey className="me-2 text-primary" /> Change Password
      </h2>
      
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="custom-card">
            <div className="card-header">
              <h5 className="mb-0 d-flex align-items-center">
                <FaLock className="me-2" /> Update Your Password
              </h5>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label d-flex align-items-center">
                    <FaKey className="me-2" /> Current Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handleChange}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label d-flex align-items-center">
                    <FaLock className="me-2" /> New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                    placeholder="Enter your new password"
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
                    <FaCheck className="me-2" /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your new password"
                    required
                    minLength="8"
                    maxLength="16"
                    pattern="(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}"
                  />
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FaKey className="me-2" /> Change Password
                      </>
                    )}
                  </button>
                  <a href="/profile" className="btn btn-secondary d-flex align-items-center">
                    <FaUndo className="me-2" /> Back to Profile
                  </a>
                </div>
              </form>
            </div>
          </div>
          
          <div className="mt-4 custom-card">
            <div className="card-header">
              <h5 className="mb-0">Password Security Tips</h5>
            </div>
            <div className="card-body">
              <ul className="mb-0">
                <li>Use a combination of letters, numbers, and special characters</li>
                <li>Avoid using easily guessable information like birthdays or names</li>
                <li>Use a different password for each of your accounts</li>
                <li>Consider using a password manager to generate and store strong passwords</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
