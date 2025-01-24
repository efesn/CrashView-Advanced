import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7237/api/Auth/login', {
        username: formData.username,
        password: formData.password,
      });

      console.log('Login Response:', response.data);
  
      const token = response.data.token;
      
      // Store user information
      localStorage.setItem('username', formData.username);
      localStorage.setItem('authToken', token);
      localStorage.setItem('isLoggedIn', 'true');
      
      // Decode the JWT token to get user claims including role
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        
        // The role claim might be in different places depending on your JWT structure
        const role = decodedToken.role || decodedToken.Role || decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        console.log('User Role from Token:', role);
        
        if (role) {
          localStorage.setItem('role', role);
        }
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
      }

      // Dispatch a custom event to notify navbar of login
      window.dispatchEvent(new Event('loginStateChange'));
  
      setNotification({ message: 'Login successful!', type: 'success' });
  
      // Use navigate instead of window.location for smoother transition
      setTimeout(() => {
        navigate('/crashes');
      }, 1500);
    } catch (error) {
      console.error('Login Error:', error.response?.data);
      if (error.response && error.response.data) {
        setNotification({ message: error.response.data.message || 'Login failed.', type: 'error' });
      } else {
        setNotification({ message: 'An error occurred. Please try again.', type: 'error' });
      }
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
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
      backgroundColor: '#C40500',
      color: 'white',
      padding: '16px',
      textAlign: 'center',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: 0,
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
      textAlign: 'left',
    },
    input: {
      padding: '8px 6px',
      fontSize: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      width: '100%',
    },
    button: {
      padding: '10px 16px',
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: '#C40500',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    footer: {
      marginTop: '16px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
    link: {
      color: '#C40500',
      textDecoration: 'none',
    },
    notification: {
      padding: '10px',
      fontSize: '14px',
      color: 'white',
      textAlign: 'center',
      width: '100%',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px',
    },
    success: {
      backgroundColor: '#4CAF50',
    },
    error: {
      backgroundColor: '#F44336',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {notification.message && (
          <div
            style={{
              ...styles.notification,
              ...(notification.type === 'success'
                ? styles.success
                : styles.error),
            }}
          >
            {notification.message}
          </div>
        )}
        <div style={styles.header}>
          <h2 style={styles.title}>Login to CrashView</h2>
        </div>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
                style={styles.input}
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                style={styles.input}
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" style={styles.button}>
              Log In
            </button>
          </form>
          <div style={styles.footer}>
            Don't have an account? <a href="/signup" style={styles.link}>Sign up here</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
