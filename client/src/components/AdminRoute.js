import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7237/api';

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#fafafa'
  },
  loadingSpinner: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    textAlign: 'center'
  },
  errorContainer: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fee2e2',
    borderRadius: '8px',
    color: '#dc2626',
    textAlign: 'center'
  }
};

const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const verifyAdmin = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Auth/verify-admin`, {
          withCredentials: true
        });

        if (isMounted) {
          setIsAdmin(response.data.isAdmin);
          setError(null);
        }
      } catch (error) {
        if (!isMounted) return;

        if (error.response?.status === 401) {
          try {
            // Token expired – attempt refresh
            await axios.post(`${API_BASE_URL}/Auth/refresh-token`, {}, { 
              withCredentials: true 
            });
            
            // Retry verification after refresh
            const retryResponse = await axios.get(`${API_BASE_URL}/Auth/verify-admin`, { 
              withCredentials: true 
            });
            
            if (isMounted) {
              setIsAdmin(retryResponse.data.isAdmin);
              setError(null);
            }
          } catch (refreshError) {
            if (isMounted) {
              setIsAdmin(false);
              setError('Your session has expired. Please log in again.');
              navigate('/login', { replace: true });
            }
          }
        } else {
          if (isMounted) {
            setIsAdmin(false);
            setError('You do not have permission to access this page.');
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifyAdmin();

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>
          <div>Verifying access...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        {error}
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;