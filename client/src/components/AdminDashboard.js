import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateCrashPage from './CreateCrashPage';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalCrashes: 0,
    totalUsers: 0,
    totalDiscussions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
    },
    sidebar: {
      width: '250px',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '2rem 0',
      display: 'flex',
      flexDirection: 'column',
    },
    sidebarHeader: {
      padding: '0 1.5rem 2rem 1.5rem',
      borderBottom: '1px solid #333',
    },
    sidebarTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    sidebarSubtitle: {
      fontSize: '0.875rem',
      color: '#9ca3af',
    },
    tabList: {
      marginTop: '2rem',
    },
    tab: {
      padding: '1rem 1.5rem',
      width: '100%',
      textAlign: 'left',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      fontSize: '0.875rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.2s',
    },
    activeTab: {
      backgroundColor: '#333',
      color: 'white',
      borderLeft: '4px solid #dc2626',
    },
    mainContent: {
      flex: 1,
      padding: '2rem',
      overflowY: 'auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1a1a1a',
    },
    logoutButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    statTitle: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
    },
    statValue: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1a1a1a',
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'manage-comments') {
      fetchComments();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': token
        }
      };

      console.log('Making API request for crashes...');

      const crashesRes = await axios.get('https://localhost:7237/api/Crashes', config);
      const discussionRes = await axios.get('https://localhost:7237/api/Discussions', config);

      
      // Handle both array and $values format
      const crashesData = crashesRes.data.$values || crashesRes.data;
      const discussionData = discussionRes.data.$values || discussionRes.data;
      
      console.log('Crashes data:', crashesData);
      console.log('Discussion data:', discussionData);

      setStats({
        totalCrashes: Array.isArray(crashesData) ? crashesData.length : 0,
        totalUsers: 0,
        totalDiscussions: Array.isArray(discussionData) ? discussionData.length : 0
      });
      setLoading(false);
    } catch (err) {
      console.error('Dashboard error:', err.response || err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('isAdminLoggedIn');
        navigate('/admin/login');
      } else {
        setError('Failed to fetch crashes data.');
      }
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': token
        }
      };

      const commentsRes = await axios.get('https://localhost:7237/api/Comments', config);
      const commentsData = commentsRes.data.$values || commentsRes.data;
      
      setComments(Array.isArray(commentsData) ? commentsData : []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to fetch comments.');
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          'Authorization': token
        }
      };

      await axios.delete(`https://localhost:7237/api/Comments/${commentId}`, config);
      
      // Update the local state to remove the deleted comment
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin/login');
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statTitle}>Total Crashes</div>
                <div style={styles.statValue}>{stats.totalCrashes}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statTitle}>Total Users</div>
                <div style={styles.statValue}>{stats.totalUsers}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statTitle}>Total Discussions</div>
                <div style={styles.statValue}>{stats.totalDiscussions}</div>
              </div>
            </div>
          </>
        );
      case 'create-crash':
        return <CreateCrashPage />;
      case 'manage-comments':
        return (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Manage Comments</h2>
            {loading ? (
              <div>Loading comments...</div>
            ) : comments.length === 0 ? (
              <div>No comments found.</div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {comments.map(comment => (
                  <div
                    key={comment.id}
                    style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#1a1a1a' }}>
                          {comment.commentText}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          By: {comment.author} • {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'manage-users':
        return <div>Manage Users Content</div>;
      case 'reports':
        return <div>Reports Content</div>;
      default:
        return <div>Select a tab</div>;
    }
  };

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ color: '#dc2626', textAlign: 'center' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitle}>CrashView Admin Dashboard</div>
        </div>
        <div style={styles.tabList}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'dashboard' ? styles.activeTab : {})
            }}
            onClick={() => handleTabClick('dashboard')}
          >
            <span>📊</span> Dashboard Overview
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'create-crash' ? styles.activeTab : {})
            }}
            onClick={() => handleTabClick('create-crash')}
          >
            <span>🚗</span> Create New Crash
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'manage-comments' ? styles.activeTab : {})
            }}
            onClick={() => handleTabClick('manage-comments')}
          >
            <span>💬</span> Manage Comments
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'manage-users' ? styles.activeTab : {})
            }}
            onClick={() => handleTabClick('manage-users')}
          >
            <span>👥</span> Manage Users
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'reports' ? styles.activeTab : {})
            }}
            onClick={() => handleTabClick('reports')}
          >
            <span>📈</span> View Reports
          </button>
        </div>
        <div style={{ marginTop: 'auto', padding: '1.5rem' }}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {loading && activeTab === 'dashboard' ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading dashboard...
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 