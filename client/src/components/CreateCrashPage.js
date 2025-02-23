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

  const [polls, setPolls] = useState([{
    question: '',
    options: ['', '']
  }]);
    
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
        crashDrivers: selectedDrivers.map(driver => ({
          driverId: driver.driverId
        }))
      };

      console.log('Submitting crash data:', crashData);

      const response = await axios.post('https://localhost:7237/api/Crashes', crashData);
      setCreatedCrash(response.data);
      setError(null);
    } catch (err) {
      console.error('Error creating crash:', err.response?.data || err.message);
      setError(err.response?.data || 'Failed to create crash');
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

  const handleAddPoll = () => {
    setPolls([...polls, {
      question: '',
      options: ['', '']
    }]);
  };

  const handleRemovePoll = (pollIndex) => {
    setPolls(polls.filter((_, index) => index !== pollIndex));
  };

  const handlePollQuestionChange = (pollIndex, question) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].question = question;
    setPolls(updatedPolls);
  };

  const handleAddOption = (pollIndex) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options.push('');
    setPolls(updatedPolls);
  };

  const handleRemoveOption = (pollIndex, optionIndex) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options.splice(optionIndex, 1);
    setPolls(updatedPolls);
  };

  const handleOptionChange = (pollIndex, optionIndex, text) => {
    const updatedPolls = [...polls];
    updatedPolls[pollIndex].options[optionIndex] = text;
    setPolls(updatedPolls);
  };

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    
    if (!createdCrash) {
      setError('Please create a crash first');
      return;
    }

    try {
      const mainPoll = polls[0];
      
      const discussionData = {
        crashId: createdCrash.id,
        title: discussionFormData.title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
        poll: {
          question: mainPoll.question,
          createdAt: new Date().toISOString(),
          options: mainPoll.options.map(optionText => ({
            text: optionText,
            votes: []
          }))
        }
      };

      console.log('Submitting discussion data:', discussionData);
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

      {/* Step 2: Create Discussion (keep this form as is) */}
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
        </div>
      </form>

      {/* Step 3: Add Polls */}
      <form onSubmit={handleDiscussionSubmit} style={{ 
        marginTop: '40px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        opacity: createdCrash ? 1 : 0.5,
        pointerEvents: createdCrash ? 'auto' : 'none'
      }}>
        <h2>Step 3: Add Polls</h2>
        
        {polls.map((poll, pollIndex) => (
          <div key={pollIndex} style={{ 
            marginBottom: '20px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Poll {pollIndex + 1}</h3>
              {polls.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePoll(pollIndex)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Poll
                </button>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Poll Question:</label>
              <input
                type="text"
                value={poll.question}
                onChange={(e) => handlePollQuestionChange(pollIndex, e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                placeholder="Enter your poll question"
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Poll Options:</label>
              {poll.options.map((option, optionIndex) => (
                <div key={optionIndex} style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginTop: '10px'
                }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(pollIndex, optionIndex, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                    required
                  />
                  {poll.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(pollIndex, optionIndex)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddOption(pollIndex)}
                style={{
                  marginTop: '10px',
                  padding: '5px 10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddPoll}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Add Another Poll
        </button>

        <button
          type="submit"
          style={{
            display: 'block',
            width: '100%',
            padding: '12px',
            backgroundColor: '#C40500',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Create Discussion with Polls
        </button>
      </form>
    </div>
  );
}

export default CreateCrashPage;