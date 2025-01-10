import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CrashPost({ id, crash, title, description }) {
  const navigate = useNavigate();

  const handleDiscussClick = () => {
    navigate(`/discussions/${id}`);
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {crash?.videoUrl ? (
        <video 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          poster={crash.videoUrl} // Use video thumbnail if available
        >
          <source src={crash.videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div style={{ 
          width: '100%', 
          height: '200px', 
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666'
        }}>
          No video available
        </div>
      )}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{title}</h2>
        <p style={{ color: '#666', marginBottom: '16px', flexGrow: 1 }}>
          {crash?.description || description || 'No description available'}
        </p>
        <button
          onClick={handleDiscussClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            backgroundColor: '#C40500',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%',
          }}
        >
          Discuss
          <span style={{ marginLeft: '8px' }}>→</span>
        </button>
      </div>
    </div>
  );
}

function CrashesPage() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/Discussions');
        setDiscussions(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load discussions');
        setLoading(false);
        console.error('Error fetching discussions:', err);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Recent Crashes</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {Array.isArray(discussions) && discussions.map(discussion => (
          <CrashPost
            key={discussion.id}
            id={discussion.id}
            crash={discussion.crash}
            title={discussion.title}
            description={discussion.crash?.description}
          />
        ))}
      </div>
    </div>
  );
}

export default CrashesPage;