import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { storeService } from '../../services/storeService';

const AdminStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [deleteStoreId, setDeleteStoreId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await storeService.getAllStores();
        setStores(res.data);
      } catch (err) {
        setError('Failed to load stores');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (storeId) => {
    setDeleteStoreId(storeId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteStoreId) return;
    
    setDeleteLoading(true);
    try {
      await storeService.deleteStore(deleteStoreId);
      setStores(stores.filter(store => store._id !== deleteStoreId));
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete store');
      console.error(err);
    } finally {
      setDeleteLoading(false);
      setDeleteStoreId(null);
    }
  };

  const filteredStores = stores.filter(store => 
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStores.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStores.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Stores</h2>
        <Link to="/admin/stores/add" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i> Add New Store
        </Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card mb-4">
        <div className="card-body">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search stores by name or address..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn btn-outline-secondary" type="button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Owner</th>
                  <th>Average Rating</th>
                  <th>Total Ratings</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No stores found</td>
                  </tr>
                ) : (
                  currentItems.map(store => (
                    <tr key={store._id}>
                      <td>{store.name}</td>
                      <td>{store.address}</td>
                      <td>{store.owner?.name || 'Not assigned'}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          {store.averageRating !== null ? store.averageRating.toFixed(1) : '0.0'}
                          <div className="ms-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <i 
                                key={`${store._id}-star-${i}`}
                                className={`fas fa-star ${i < Math.round(store.averageRating || 0) ? 'text-warning' : 'text-secondary'} small`}
                              ></i>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{store.totalRatings}</td>
                      <td>
                        <div className="btn-group">
                          <Link 
                            to={`/stores/${store._id}`}
                            className="btn btn-sm btn-info"
                            title="View"
                          >
                            <i className="fas fa-eye"></i>
                          </Link>
                          <Link 
                            to={`/admin/stores/edit/${store._id}`}
                            className="btn btn-sm btn-warning"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button 
                            className="btn btn-sm btn-danger"
                            title="Delete"
                            onClick={() => handleDeleteClick(store._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this store? This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleConfirmDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Store'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStores;
