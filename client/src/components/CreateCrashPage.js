import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Common styles object
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  title: {
    fontSize: '2rem',
    marginBottom: '32px',
    fontWeight: '600',
    color: '#1a1a1a',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '16px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    marginBottom: '24px',
    color: '#2d2d2d',
    fontWeight: '500'
  },
  formGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#4a4a4a'
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    backgroundColor: '#fafafa',
    '&:focus': {
      outline: 'none',
      borderColor: '#000000',
      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
    }
  },
  textarea: {
    minHeight: '120px',
    resize: 'vertical'
  },
  select: {
    minHeight: '120px'
  },
  errorContainer: {
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    padding: '16px',
    borderRadius: '6px',
    marginBottom: '24px',
    border: '1px solid #fee2e2'
  },
  section: {
    backgroundColor: '#fafafa',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '32px',
    border: '1px solid #f0f0f0'
  },
  helpText: {
    color: '#666666',
    fontSize: '0.875rem',
    marginTop: '6px'
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 28px',
    backgroundColor: '#000000',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    width: '100%',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#1a1a1a'
    },
    '&:disabled': {
      backgroundColor: '#666666',
      cursor: 'not-allowed'
    }
  }
};

function CreateCrashPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [formData, setFormData] = useState({
    crash: {
      description: '',
      videoUrl: '',
      date: new Date().toISOString().split('T')[0],
      driversInCrash: []
    },
    discussion: {
      title: '',
    },
    poll: {
      question: '',
    }
  });

  // Fetch drivers when component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/Drivers');
        console.log('Drivers response:', response.data); // Debug log
        // Check if the data is in $values property (common in .NET responses)
        const driversData = response.data.$values || response.data;
        setDrivers(Array.isArray(driversData) ? driversData : []);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load drivers');
      }
    };

    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDriverSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => ({
      DriverId: parseInt(option.value),
      DamageLevel: 1, // Integer value: 1 = Minor, 2 = Moderate, 3 = Severe
      IsResponsible: false,
      InjuryStatus: false
    }));

    setFormData(prev => ({
      ...prev,
      crash: {
        ...prev.crash,
        driversInCrash: selectedOptions
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      // First create the crash
      const crashResponse = await axios.post('https://localhost:7237/api/Crashes', {
        Date: new Date(formData.crash.date).toISOString(),
        Description: formData.crash.description,
        VideoUrl: formData.crash.videoUrl,
        DriversInCrash: formData.crash.driversInCrash
      }, config);

      console.log('Crash created:', crashResponse.data);

      // Create discussion data
      const discussionData = {
        Title: formData.discussion.title,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString(),
        Comments: [],
        CrashId: crashResponse.data.id,
        Crash: crashResponse.data // Include the complete crash object
      };

      // Create poll if there's a question
      if (formData.poll.question) {
        const pollData = {
          Question: formData.poll.question,
          Votes: [],
          CreatedAt: new Date().toISOString(),
          DiscussionId: 0
        };

        // Set up circular reference properly
        discussionData.Poll = pollData;
        pollData.Discussion = discussionData;
      }

      console.log('Sending discussion data:', discussionData);
      const discussionResponse = await axios.post('https://localhost:7237/api/Discussions', discussionData, config);

      console.log('Discussion created:', discussionResponse.data);

      // Redirect to the new discussion page
      navigate(`/discuss/${discussionResponse.data.id}`);
    } catch (err) {
      console.error('API Error Response:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to create crash and discussion';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Crash Discussion</h1>

      {error && (
        <div style={styles.errorContainer}>
          {typeof error === 'object' ? JSON.stringify(error, null, 2) : error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Crash Details Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Crash Details</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="crash.description"
              value={formData.crash.description}
              onChange={handleChange}
              required
              style={{...styles.input, ...styles.textarea}}
              placeholder="Describe what happened in the crash..."
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Video URL:</label>
            <input
              type="url"
              name="crash.videoUrl"
              value={formData.crash.videoUrl}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="https://example.com/video.mp4"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date:</label>
            <input
              type="date"
              name="crash.date"
              value={formData.crash.date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Drivers Involved:</label>
            <select
              multiple
              onChange={handleDriverSelection}
              required
              style={{...styles.input, ...styles.select}}
            >
              {Array.isArray(drivers) && drivers.length > 0 ? (
                drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.firstName} {driver.lastName} - {driver.team?.name || 'No Team'}
                  </option>
                ))
              ) : (
                <option disabled>No drivers available</option>
              )}
            </select>
            <small style={styles.helpText}>
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple drivers. Selected drivers will be marked as involved in the crash.
            </small>
          </div>

          {formData.crash.driversInCrash.length > 0 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Selected Drivers:</label>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e0e0e0'
              }}>
                {formData.crash.driversInCrash.map(crashDriver => {
                  const driver = drivers.find(d => d.id === crashDriver.DriverId);
                  return driver ? (
                    <div key={driver.id} style={{ marginBottom: '8px' }}>
                      {driver.firstName} {driver.lastName} - {driver.team?.name || 'No Team'}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Discussion Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Discussion Details</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Discussion Title:</label>
            <input
              type="text"
              name="discussion.title"
              value={formData.discussion.title}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="Enter a title for the discussion..."
            />
          </div>
        </div>

        {/* Poll Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Poll (Optional)</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Poll Question:</label>
            <input
              type="text"
              name="poll.question"
              value={formData.poll.question}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., Who was at fault in this incident?"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            backgroundColor: loading ? '#666666' : '#000000'
          }}
        >
          {loading ? 'Creating...' : 'Create Crash Discussion'}
        </button>
      </form>
    </div>
  );
}

export default CreateCrashPage; 