import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { FaStore, FaUser, FaSignOutAlt, FaUserCog, FaLock, FaUsers, FaList, FaPlus } from 'react-icons/fa';

const AppNavbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="custom-navbar mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <FaStore className="me-2" /> Store Ratings
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/stores" className="d-flex align-items-center">
              <FaList className="me-1" /> Stores
            </Nav.Link>
            
            {isAuthenticated && currentUser.role === 'admin' && (
              <NavDropdown title={<span><FaUserCog className="me-1" /> Admin</span>} id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/admin">Dashboard</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/stores">Manage Stores</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">Manage Users</NavDropdown.Item>
              </NavDropdown>
            )}
            
            {isAuthenticated && currentUser.role === 'store_owner' && (
              <Nav.Link as={Link} to="/store-owner/dashboard" className="d-flex align-items-center">
                <FaStore className="me-1" /> Dashboard
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <NavDropdown 
                title={
                  <span className="d-flex align-items-center">
                    <FaUser className="me-1" /> {currentUser.name}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                  <FaUser className="me-2" /> Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/change-password" className="d-flex align-items-center">
                  <FaLock className="me-2" /> Change Password
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <FaUser className="me-1" /> Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="d-flex align-items-center">
                  <FaPlus className="me-1" /> Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
