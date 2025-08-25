import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { storeService } from '../../services/storeService';
import { ratingService } from '../../services/ratingService';

const StoreDetails = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const storeRes = await storeService.getStoreById(id);
        setStore(storeRes.data);
        
        const ratingsRes = await ratingService.getStoreRatings(id);
        setRatings(ratingsRes.data);
        
        if (isAuthenticated) {
          try {
            const userRatingRes = await ratingService.getUserRating(id);
            if (userRatingRes.data) {
              setUserRating(userRatingRes.data);
              setRatingValue(userRatingRes.data.rating);
              setComment(userRatingRes.data.comment);
            }
          } catch (err) {
            // User hasn't rated this store yet
            console.log('No existing rating found');
          }
        }
      } catch (err) {
        setError('Failed to load store details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreDetails();
  }, [id, isAuthenticated]);

  const handleRatingChange = (value) => {
    setRatingValue(value);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (ratingValue === 0) {
      setError('Please select a rating');
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (userRating) {
        // Update existing rating
        await ratingService.updateRating(userRating._id, {
          rating: ratingValue,
          comment
        });
      } else {
        // Create new rating
        await ratingService.createRating({
          storeId: id,
          rating: ratingValue,
          comment
        });
      }
      
      // Refresh ratings
      const ratingsRes = await ratingService.getStoreRatings(id);
      setRatings(ratingsRes.data);
      
      // Refresh store details to update average rating
      const storeRes = await storeService.getStoreById(id);
      setStore(storeRes.data);
      
      // Update user rating
      const userRatingRes = await ratingService.getUserRating(id);
      setUserRating(userRatingRes.data);
      
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  if (!store) {
    return <div className="alert alert-danger">Store not found</div>;
  }

  return (
    <div>
      <h2 className="mb-4">{store.name}</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row mb-4">
        <div className="col-md-6">
          {store.image ? (
            <img 
              src={store.image} 
              alt={store.name} 
              className="img-fluid rounded" 
              style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '300px' }}>
              <i className="fas fa-store fa-5x text-secondary"></i>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Store Details</h5>
              <p className="card-text">
                <i className="fas fa-map-marker-alt me-2"></i>
                <strong>Location:</strong> {store.location}
              </p>
              <p className="card-text">
                <i className="fas fa-user me-2"></i>
                <strong>Owner:</strong> {store.owner?.name || 'Not assigned'}
              </p>
              <p className="card-text">
                <i className="fas fa-phone me-2"></i>
                <strong>Contact:</strong> {store.contact || 'Not available'}
              </p>
              <p className="card-text">
                <i className="fas fa-clock me-2"></i>
                <strong>Hours:</strong> {store.hours || 'Not specified'}
              </p>
              <div className="mb-3">
                <h6>Rating:</h6>
                <div className="d-flex align-items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.round(store.averageRating) ? 'text-warning' : 'text-secondary'} me-1`}
                    ></i>
                  ))}
                  <span className="ms-2 fw-bold">{store.averageRating.toFixed(1)}/5</span>
                  <span className="ms-2 text-muted">({store.totalRatings} reviews)</span>
                </div>
              </div>
              <p className="card-text">
                {store.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Rate this Store</h5>
            </div>
            <div className="card-body">
              {!isAuthenticated ? (
                <div className="alert alert-info">
                  Please <a href="/login">login</a> to leave a rating
                </div>
              ) : (
                <form onSubmit={handleSubmitRating}>
                  <div className="mb-3">
                    <label className="form-label">Your Rating:</label>
                    <div className="rating-stars mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star fa-lg ${i < ratingValue ? 'text-warning' : 'text-secondary'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRatingChange(i + 1)}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Your Review (Optional):</label>
                    <textarea
                      id="comment"
                      className="form-control"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting || ratingValue === 0}
                  >
                    {submitting ? 'Submitting...' : userRating ? 'Update Review' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">Customer Reviews</h5>
            </div>
            <div className="card-body">
              {ratings.length === 0 ? (
                <p className="text-center text-muted">No reviews yet. Be the first to review!</p>
              ) : (
                <div className="review-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {ratings.map(rating => (
                    <div key={rating._id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="mb-0">{rating.user?.name || 'Anonymous'}</h6>
                          <div className="mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={i} 
                                className={`fas fa-star ${i < rating.rating ? 'text-warning' : 'text-secondary'} small`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <small className="text-muted">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-0">{rating.comment || <em>No comment provided</em>}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDetails;
