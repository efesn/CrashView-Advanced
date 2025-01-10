import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewDiscussionPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [crashes, setCrashes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    crashId: '',
    poll: {
      question: '',
    }
  });
  const [error, setError] = useState(null);

  // Fetch available crashes for selection
  useEffect(() => {
    const fetchCrashes = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/Crashes');
        setCrashes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load crashes');
        setLoading(false);
      }
    };

    fetchCrashes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7237/api/Discussions', {
        title: formData.title,
        crashId: parseInt(formData.crashId),
        poll: formData.poll.question ? {
          question: formData.poll.question,
          votes: []
        } : null,
        comments: []
      });

      // Redirect to the newly created discussion
      navigate(`/discussions/${response.data.id}`);
    } catch (error) {
      setError('Failed to create discussion');
      console.error('Error creating discussion:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('poll.')) {
      setFormData(prev => ({
        ...prev,
        poll: {
          ...prev.poll,
          [name.split('.')[1]]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#C40500' }}>
        Create New Discussion
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Select Crash:
          </label>
          <select
            name="crashId"
            value={formData.crashId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">Select a crash...</option>
            {crashes.map(crash => (
              <option key={crash.id} value={crash.id}>
                {crash.description}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Poll Question (Optional):
          </label>
          <input
            type="text"
            name="poll.question"
            value={formData.poll.question}
            onChange={handleChange}
            placeholder="e.g., Who was at fault in this incident?"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#C40500',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Create Discussion
        </button>
      </form>
    </div>
  );
}

export default NewDiscussionPage;