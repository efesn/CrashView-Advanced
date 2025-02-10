import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import CrashesPage from './components/CrashesPage.js';
import DiscussPage from './components/DiscussPage.js';
import SignUpPage from './components/Signup.js';
import LoginPage from './components/Login.js';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CreateCrashPage from './components/CreateCrashPage.js';

// Admin route protection
const AdminRoute = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
  return isAdminLoggedIn ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <AdminRoute>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="create-crash" element={<CreateCrashPage />} />
                {/* Add more admin routes here */}
              </Routes>
            </AdminRoute>
          } />

          {/* Public routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <main style={{ padding: '2rem' }}>
                <CrashesPage />
              </main>
            </>
          } />
          <Route path="/signup" element={
            <>
              <Navbar />
              <main style={{ padding: '2rem' }}>
                <SignUpPage />
              </main>
            </>
          } />
          <Route path="/login" element={
            <>
              <Navbar />
              <main style={{ padding: '2rem' }}>
                <LoginPage />
              </main>
            </>
          } />
          <Route path="/crashes" element={
            <>
              <Navbar />
              <main style={{ padding: '2rem' }}>
                <CrashesPage />
              </main>
            </>
          } />
          <Route path="/discuss/:id" element={
            <>
              <Navbar />
              <main style={{ padding: '2rem' }}>
                <DiscussPage />
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
