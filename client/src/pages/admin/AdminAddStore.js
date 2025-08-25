import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { storeService } from '../../services/storeService';

const AdminAddStore = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    description: '',
    contact: '',
    hours: '',
    owner_id: ''
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ownersLoading, setOwnersLoading] = useState(true);
  
  const navigate = useNavigate();

  const { name, email, address, description, contact, hours, owner_id } = formData;

  useEffect(() => {
    const fetchStoreOwners = async () => {
      try {
        const res = await api.get('/api/admin/users?role=storeOwner');
        setStoreOwners(res.data.data);
      } catch (err) {
        console.error('Failed to load store owners', err);
      } finally {
        setOwnersLoading(false);
      }
    };

    fetchStoreOwners();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !address || !email) {
      return setError('Store name, email, and address are required');
    }
    
    // Validate name length (min 1, max 100 characters)
    if (name.length < 1 || name.length > 100) {
      return setError('Store name must be between 1 and 100 characters');
    }
    
    // Validate location/address (max 400 characters)
    if (address.length > 400) {
      return setError('Address must not exceed 400 characters');
    }
    
    setLoading(true);
    setError('');
    
    try {
      await storeService.createStore(formData);
      navigate('/admin/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create store');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Add New Store</h2>
      
      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="name" className="form-label">Store Name *</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  required
                  minLength="1"
                  maxLength="100"
                />
                <div className="form-text">
                  Between 1 and 100 characters
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                />
                <div className="form-text">
                  Store contact email
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Address *</label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={address}
                onChange={handleChange}
                required
                maxLength="400"
              />
              <div className="form-text">
                Maximum 400 characters
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="contact" className="form-label">Contact Information</label>
                <input
                  type="text"
                  className="form-control"
                  id="contact"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                  placeholder="Phone, email, etc."
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label htmlFor="hours" className="form-label">Business Hours</label>
                <input
                  type="text"
                  className="form-control"
                  id="hours"
                  name="hours"
                  value={hours}
                  onChange={handleChange}
                  placeholder="e.g., Mon-Fri: 9am-5pm"
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="owner_id" className="form-label">Store Owner</label>
              <select
                className="form-select"
                id="owner_id"
                name="owner_id"
                value={owner_id}
                onChange={handleChange}
              >
                <option value="">-- Select Store Owner --</option>
                {ownersLoading ? (
                  <option disabled>Loading store owners...</option>
                ) : (
                  storeOwners.map(owner => (
                    <option key={owner._id} value={owner._id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))
                )}
              </select>
              <div className="form-text">
                Assign a store owner or leave blank to assign later
              </div>
            </div>
            
            <div className="d-flex justify-content-end mt-4">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate('/admin/stores')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddStore;
