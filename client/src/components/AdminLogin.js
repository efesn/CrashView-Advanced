import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
    },
    subtitle: {
      fontSize: '14px',
      color: '#9ca3af',
      marginTop: '8px',
    },
    content: {
      padding: '24px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#374151',
    },
    input: {
      padding: '10px 12px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      width: '100%',
      transition: 'border-color 0.2s',
    },
    button: {
      padding: '12px',
      fontSize: '16px',
      fontWeight: '500',
      color: 'white',
      backgroundColor: '#1a1a1a',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#333333',
    },
    error: {
      color: '#dc2626',
      fontSize: '14px',
      marginTop: '8px',
      textAlign: 'center',
    },
    backLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '16px',
      color: '#6b7280',
      textDecoration: 'none',
      fontSize: '14px',
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Starting admin login attempt...');
      console.log('API URL:', 'https://localhost:7237/api/Auth/login');
      console.log('Request payload:', {
        UserName: formData.username,
        Password: formData.password
      });

      const response = await axios.post('https://localhost:7237/api/Auth/login', {
        UserName: formData.username,
        Password: formData.password
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Login response:', response.data);

      if (response.data.role === 'Admin') {
        localStorage.setItem('adminToken', `Bearer ${response.data.token}`);
        localStorage.setItem('isAdminLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Only administrators can access this area.');
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Login error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          headers: err.config?.headers
        }
      });
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Login to access admin controls</p>
        </div>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter admin username"
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter admin password"
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                backgroundColor: loading ? '#6b7280' : '#1a1a1a',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Logging in...' : 'Login to Dashboard'}
            </button>
          </form>
          <a href="/" style={styles.backLink}>← Back to main site</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 