import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { storeService } from '../../services/storeService';
import { FaSearch, FaSort, FaStore, FaSortAlphaDown, FaSortAlphaUp, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeService.getAllStores();
        if (res.error) {
          setError('Failed to load stores: ' + res.error);
          setStores([]);
        } else {
          setStores(res.data || []);
        }
      } catch (err) {
        setError('Failed to load stores: ' + (err.message || 'Unknown error'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStores = [...filteredStores].sort((a, b) => {
    if (sortBy === 'rating') {
      return sortOrder === 'asc' 
        ? a.averageRating - b.averageRating 
        : b.averageRating - a.averageRating;
    } else {
      return sortOrder === 'asc'
        ? a[sortBy].localeCompare(b[sortBy])
        : b[sortBy].localeCompare(a[sortBy]);
    }
  });

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
      <h2 className="mb-4">Browse Stores</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="custom-card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search stores by name or location..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="btn-group">
                <button 
                  className={`btn ${sortBy === 'name' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('name')}
                >
                  <span className="d-flex align-items-center">
                    <FaSort className="me-1" /> Name 
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <FaSortAlphaDown className="ms-1" /> : <FaSortAlphaUp className="ms-1" />
                    )}
                  </span>
                </button>
                <button 
                  className={`btn ${sortBy === 'address' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('address')}
                >
                  <span className="d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1" /> Location
                    {sortBy === 'address' && (
                      sortOrder === 'asc' ? <FaSortAlphaDown className="ms-1" /> : <FaSortAlphaUp className="ms-1" />
                    )}
                  </span>
                </button>
                <button 
                  className={`btn ${sortBy === 'rating' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleSort('rating')}
                >
                  <span className="d-flex align-items-center">
                    <FaStar className="me-1" /> Rating
                    {sortBy === 'rating' && (
                      sortOrder === 'asc' ? <FaSortAlphaDown className="ms-1" /> : <FaSortAlphaUp className="ms-1" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        {sortedStores.length === 0 ? (
          <div className="col-12 text-center mt-4">
            <p>No stores found. Please try a different search term.</p>
          </div>
        ) : (
          sortedStores.map(store => (
            <div key={store.id} className="col-md-4 mb-4">
              <div className="custom-card h-100">
                {store.image && (
                  <img src={store.image} className="card-img-top" alt={store.name} style={{ height: '200px', objectFit: 'cover' }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{store.name}</h5>
                  <p className="card-text d-flex align-items-center">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    {store.address}
                  </p>
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < Math.round(store.averageRating) ? 'text-warning' : 'text-secondary'}
                          style={{ marginRight: '2px' }}
                        />
                      ))}
                      <span className="ms-2 text-muted">({store.ratingCount} reviews)</span>
                    </div>
                  </div>
                  <Link to={`/stores/${store.id}`} className="btn btn-primary w-100">
                    <FaStore className="me-2" /> View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StoresList;


