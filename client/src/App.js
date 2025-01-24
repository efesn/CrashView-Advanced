import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar';
import CrashesPage from './components/CrashesPage.js';
import DiscussPage from './components/DiscussPage.js';
import SignUpPage from './components/Signup.js';
import LoginPage from './components/Login.js';
import CreateCrashPage from './components/CreateCrashPage.js';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<CrashesPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/crashes" element={<CrashesPage />} />
            <Route path="/discuss/:id" element={<DiscussPage />} />
            <Route 
              path="/admin/create-crash" 
              element={
                <AdminRoute>
                  <CreateCrashPage />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
