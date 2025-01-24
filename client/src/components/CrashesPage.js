import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CrashPost({ id, title, description, imageUrl }) {
  const navigate = useNavigate();

  const handleDiscussClick = () => {
    navigate(`/discuss/${id}`);
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ 
        width: '100%', 
        height: '200px', 
        overflow: 'hidden',
        position: 'relative'
      }}>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover'
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            No image available
          </div>
        )}
      </div>
      <div style={{ 
        padding: '16px', 
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: 1,
        backgroundColor: 'white'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          marginBottom: '8px',
          fontWeight: '500'
        }}>{title}</h2>
        <p style={{ 
          color: '#666', 
          marginBottom: '16px', 
          flexGrow: 1,
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}>
          {description || 'No description available'}
        </p>
        <button
          onClick={handleDiscussClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 16px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            width: '100%',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#333333'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#000000'}
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
        const discussionsData = response.data.$values || [];
        setDiscussions(discussionsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load discussions');
        setLoading(false);
        console.error('Error fetching discussions:', err);
      }
    };

    fetchDiscussions();
  }, []);

  if (loading) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '50vh' 
    }}>
      Loading...
    </div>
  );
  
  if (error) return (
    <div style={{ 
      color: '#C40500', 
      textAlign: 'center', 
      marginTop: '2rem' 
    }}>
      {error}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '20px',
        fontWeight: '600',
        color: '#111'
      }}>
        Crashes
      </h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '24px',
        padding: '12px 0'
      }}>
        {discussions.map(discussion => (
          <CrashPost
            key={discussion.id}
            id={discussion.id}
            title={discussion.title}
            description={discussion.crash?.description || discussion.title}
            imageUrl={discussion.crash?.thumbnailUrl || discussion.crash?.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}

export default CrashesPage;