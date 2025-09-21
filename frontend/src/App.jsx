// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Welcome from './components/common/Welcome';
import Home from './components/common/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import About from './components/common/About';
import Contact from './components/common/Contact';
import CustomerDashboard from './components/customer/CustomerDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import NotFound from './components/common/NotFound';
import './assets/css/App.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  // Helper functions to check authentication from sessionStorage
  const isAuthenticated = () => sessionStorage.getItem('token') !== null;
  const isAdmin = () => sessionStorage.getItem('role') === 'admin';

  // Protected route for Customers
  const CustomerRoute = ({ children }) => {
    if (!isAuthenticated() || isAdmin()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Protected route for Admins
  const AdminRoute = ({ children }) => {
    if (!isAuthenticated() || !isAdmin()) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      {showWelcome ? (
        <Welcome />
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Customer Route */}
          <Route
            path="/customer/*"
            element={
              <CustomerRoute>
                <CustomerDashboard />
              </CustomerRoute>
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;