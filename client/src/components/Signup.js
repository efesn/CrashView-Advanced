import React, { useState } from 'react';
import axios from 'axios';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      await axios.post(
        'https://localhost:7237/api/Auth/register',
        {
          userName: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );
      setNotification({
        message: 'User registered successfully!',
        type: 'success',
      });
    } catch (error) {
      setNotification({
        message: error.response?.data || 'An error occurred. Please try again.',
        type: 'error',
      });
    }

    // Clear the notification after a few seconds
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
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
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '4px',
      fontSize: '16px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
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
        <div style={styles.header}>
          <h2 style={styles.title}>Sign Up for CrashView</h2>
        </div>
        <div style={styles.content}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
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
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                style={styles.input}
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
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
              Sign Up
            </button>
          </form>
          <div style={styles.footer}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>
              Login here
            </a>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default SignUpPage;
