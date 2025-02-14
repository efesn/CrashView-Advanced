import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateCrashPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [createdCrash, setCreatedCrash] = useState(null);

  const [crashFormData, setCrashFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    videoUrl: ''
  });

  const [discussionFormData, setDiscussionFormData] = useState({
    title: '',
    pollQuestion: '',
    pollOptions: [
      { text: 'Responsible', drivers: [] },
      { text: 'Not Responsible', drivers: [] },
      { text: 'Racing Incident', drivers: [] }
    ]
  });
    
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/Drivers');
        const driversData = response.data.$values || response.data;
        setDrivers(Array.isArray(driversData) ? driversData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching drivers:', err);
        setError('Failed to load drivers');
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleDriverSelect = (driverId) => {
    const driverInfo = {
      driverId: parseInt(driverId),
      damageLevel: 1,
      isResponsible: false,
      injuryStatus: false
    };

    setSelectedDrivers(prev => {
      const exists = prev.find(d => d.driverId === driverInfo.driverId);
      if (exists) {
        return prev.filter(d => d.driverId !== driverInfo.driverId);
      }
      return [...prev, driverInfo];
    });
  };

  const updateDriverInfo = (driverId, field, value) => {
    setSelectedDrivers(prev => prev.map(driver => {
      if (driver.driverId === driverId) {
        return { ...driver, [field]: value };
      }
      return driver;
    }));
  };

  const handleCrashSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const crashData = {
        date: new Date(crashFormData.date).toISOString(),
        description: crashFormData.description,
        videoUrl: crashFormData.videoUrl,
        driversInCrash: selectedDrivers.map(driver => ({
          driverId: driver.driverId,
        }))
      };

      const response = await axios.post('https://localhost:7237/api/Crashes', crashData);
      setCreatedCrash(response.data);
      setError(null);
    } catch (err) {
      console.error('Error creating crash:', err);
      setError('Failed to create crash');
    }
  };

  const handleDriverPollSelect = (optionIndex, driverId) => {
    setDiscussionFormData(prev => {
      const newPollOptions = [...prev.pollOptions];
      const drivers = newPollOptions[optionIndex].drivers;
      
      if (drivers.includes(driverId)) {
        newPollOptions[optionIndex].drivers = drivers.filter(id => id !== driverId);
      } else {
        // Remove driver from other options first
        newPollOptions.forEach((option, idx) => {
          if (idx !== optionIndex) {
            option.drivers = option.drivers.filter(id => id !== driverId);
          }
        });
        newPollOptions[optionIndex].drivers.push(driverId);
      }
      
      return { ...prev, pollOptions: newPollOptions };
    });
  };

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    
    if (!createdCrash) {
      setError('Please create a crash first');
      return;
    }

    try {
      const discussionData = {
        crashId: createdCrash.id,
        title: discussionFormData.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        poll: {
          question: discussionFormData.pollQuestion,
          createdAt: new Date().toISOString(),
          options: discussionFormData.pollOptions.map(option => ({
            text: option.text,
            pollOptionDrivers: option.drivers.map(driverId => ({
              driverId: driverId
            }))
          })),
          votes: []
        }
      };

      console.log('Submitting discussion data:', discussionData); // For debugging
      await axios.post('https://localhost:7237/api/Discussions', discussionData);
      navigate('/crashes');
    } catch (err) {
      console.error('Error creating discussion:', err);
      setError('Failed to create discussion');
    }
  };

  if (loading) return <div>Loading drivers...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Create New Crash</h1>

      {/* Crash Form */}
      <form onSubmit={handleCrashSubmit} style={{ 
        marginBottom: '40px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: createdCrash ? '#f8f8f8' : 'white'
      }}>
        <h2>Step 1: Create Crash</h2>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Date:</label>
            <input
              type="date"
              value={crashFormData.date}
              onChange={(e) => setCrashFormData({ ...crashFormData, date: e.target.value })}
              required
              disabled={createdCrash}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label>
            <textarea
              value={crashFormData.description}
              onChange={(e) => setCrashFormData({ ...crashFormData, description: e.target.value })}
              required
              disabled={createdCrash}
              style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '100px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Video URL:</label>
            <input
              type="url"
              value={crashFormData.videoUrl}
              onChange={(e) => setCrashFormData({ ...crashFormData, videoUrl: e.target.value })}
              required
              disabled={createdCrash}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>

        {/* Driver Selection */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Involved Drivers</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            {drivers.map(driver => (
              <div 
                key={driver.id}
                style={{
                  padding: '10px',
                  border: selectedDrivers.find(d => d.driverId === driver.id) 
                    ? '2px solid #C40500' 
                    : '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: createdCrash ? 'not-allowed' : 'pointer',
                  opacity: createdCrash ? 0.7 : 1
                }}
                onClick={() => !createdCrash && handleDriverSelect(driver.id)}
              >
                {driver.firstName} {driver.lastName}
              </div>
            ))}
          </div>

          {/* Driver Details */}
          {selectedDrivers.map(driver => {
            const driverInfo = drivers.find(d => d.id === driver.driverId);
            return (
              <div key={driver.driverId} style={{ 
                marginBottom: '15px', 
                padding: '20px', 
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}>
               {/* 
               
               */} <h3 style={{ 
                  marginBottom: '15px',
                  color: '#333',
                  borderBottom: '2px solid #C40500',
                  paddingBottom: '8px'
                }}>
                  {driverInfo?.firstName} {driverInfo?.lastName}
                </h3>
                
                <div style={{ 
                  display: 'grid',
                  gap: '15px'
                }}>
                  

                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: createdCrash ? 'not-allowed' : 'pointer'
                    }}>
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={createdCrash}
          style={{
            backgroundColor: createdCrash ? '#888' : '#C40500',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: createdCrash ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {createdCrash ? 'Crash Created' : 'Create Crash'}
        </button>
      </form>

      {/* Discussion Form */}
      <form onSubmit={handleDiscussionSubmit} style={{ 
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        opacity: createdCrash ? 1 : 0.5,
        pointerEvents: createdCrash ? 'auto' : 'none'
      }}>
        <h2>Step 2: Create Discussion</h2>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Discussion Title:</label>
            <input
              type="text"
              value={discussionFormData.title}
              onChange={(e) => setDiscussionFormData({ ...discussionFormData, title: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label>Poll Question:</label>
            <input
              type="text"
              value={discussionFormData.pollQuestion}
              onChange={(e) => setDiscussionFormData({ ...discussionFormData, pollQuestion: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
              placeholder="e.g., Who was responsible for the crash?"
            />
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Poll Options</h3>
            {discussionFormData.pollOptions.map((option, optionIndex) => (
              <div key={optionIndex} style={{ 
                marginBottom: '20px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <h4>{option.text}</h4>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '10px',
                  marginTop: '10px'
                }}>
                  {selectedDrivers.map(driver => {
                    const driverInfo = drivers.find(d => d.id === driver.driverId);
                    const isSelected = option.drivers.includes(driver.driverId);
                    
                    return (
                      <div
                        key={driver.driverId}
                        onClick={() => handleDriverPollSelect(optionIndex, driver.driverId)}
                        style={{
                          padding: '8px',
                          border: isSelected ? '2px solid #C40500' : '1px solid #ddd',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#fff0f0' : 'white',
                          textAlign: 'center'
                        }}
                      >
                        {driverInfo?.firstName} {driverInfo?.lastName}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: '#C40500',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Discussion
        </button>
      </form>
    </div>
  );
}

export default CreateCrashPage;