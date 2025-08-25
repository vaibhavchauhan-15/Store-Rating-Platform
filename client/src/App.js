import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { setupScrollAnimations } from './utils/animations';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import StoreOwnerRoute from './components/routing/StoreOwnerRoute';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import StoresList from './pages/stores/StoresList';
import StoreDetails from './pages/stores/StoreDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStores from './pages/admin/AdminStores';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminAddUser from './pages/admin/AdminAddUser';
import UserProfile from './pages/user/UserProfile';
import ChangePassword from './pages/user/ChangePassword';
import StoreOwnerDashboard from './pages/storeOwner/StoreOwnerDashboard';
import NotFound from './pages/NotFound';

function App() {
  const { isLoading } = useAuth();

  // Setup animations when component mounts
  useEffect(() => {
    setupScrollAnimations();
  }, []);

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container py-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/stores" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<StoresList />} />
          <Route path="/stores/:id" element={<StoreDetails />} />

          {/* Protected Routes for all authenticated users */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/stores" element={<AdminRoute><AdminStores /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/stores/add" element={<AdminRoute><AdminAddStore /></AdminRoute>} />
          <Route path="/admin/users/add" element={<AdminRoute><AdminAddUser /></AdminRoute>} />

          {/* Store Owner Routes */}
          <Route path="/store-owner/dashboard" element={<StoreOwnerRoute><StoreOwnerDashboard /></StoreOwnerRoute>} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
