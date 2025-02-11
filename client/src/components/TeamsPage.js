import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Team logo mapping with variations of team names
const teamLogos = {
  'Red Bull Racing': 'https://upload.wikimedia.org/wikipedia/en/4/44/Red_bull_racing.png',
  'Mercedes-AMG': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg/1280px-Mercedes_AMG_Petronas_F1_Logo.svg.png',
  'Scuderia Ferrari': 'https://upload.wikimedia.org/wikipedia/tr/f/f0/Scuderia_Ferrari.png',
  'McLaren F1 Team': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/66/McLaren_Racing_logo.svg/1280px-McLaren_Racing_logo.svg.png',
  'Aston Martin': 'https://upload.wikimedia.org/wikipedia/en/1/15/Aston_Martin_Aramco_2024_logo.png',
  'Alpine': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Alpine_F1_Team_Logo.svg/2560px-Alpine_F1_Team_Logo.svg.png',
  'Alpine F1 Team': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Alpine_F1_Team_Logo.svg/2560px-Alpine_F1_Team_Logo.svg.png',
  'Williams Racing': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Williams_Racing_2020_logo.png',
  'Racing Bulls': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/VCARB_F1_logo.svg/1200px-VCARB_F1_logo.svg.png',
  'Kick Sauber': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/2023_Stake_F1_Team_Kick_Sauber_logo.png/640px-2023_Stake_F1_Team_Kick_Sauber_logo.png',
  'Haas F1 Team': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/MoneyGram_Haas_F1_Team_Logo.svg/1920px-MoneyGram_Haas_F1_Team_Logo.svg.png'
};

// Function to find the matching logo URL
const getTeamLogo = (teamName) => {
  // First try exact match
  if (teamLogos[teamName]) {
    return teamLogos[teamName];
  }

  // Try case-insensitive match
  const lowerTeamName = teamName.toLowerCase();
  const logoKey = Object.keys(teamLogos).find(key => 
    key.toLowerCase() === lowerTeamName ||
    lowerTeamName.includes(key.toLowerCase()) ||
    key.toLowerCase().includes(lowerTeamName)
  );

  return logoKey ? teamLogos[logoKey] : 'https://via.placeholder.com/200x100?text=Team+Logo';
};

function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('https://localhost:7237/api/Teams');
        const teamsData = response.data.$values || response.data;
        console.log('Fetched teams:', teamsData); // Debug log
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Failed to load teams');
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        Loading teams...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: '#C40500', 
        textAlign: 'center', 
        marginTop: '2rem' 
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ 
        fontSize: '2rem', 
        marginBottom: '32px',
        color: '#111',
        borderBottom: '2px solid #C40500',
        paddingBottom: '8px'
      }}>
        F1 Teams
      </h1>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
        padding: '12px 0'
      }}>
        {teams.map(team => {
          const logoUrl = getTeamLogo(team.name);
          
          return (
            <div
              key={team.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '1px solid #eee',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              {/* Team Header/Banner */}
              <div style={{
                height: '160px',
                backgroundColor: team.color || '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {/* Team Logo */}
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  padding: '12px',
                  borderRadius: '8px'
                }}>
                  <img
                    src={logoUrl}
                    alt={`${team.name} logo`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      console.log('Image load error for team:', team.name); // Debug log
                      e.target.src = 'https://via.placeholder.com/200x100?text=Team+Logo';
                    }}
                  />
                </div>
              </div>

              {/* Team Info */}
              <div style={{ padding: '20px' }}>
                {/* Team Name */}
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#111',
                  textAlign: 'center'
                }}>
                  {team.name}
                </h2>

                {/* Base Info */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Drivers Section */}
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '6px'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#444'
                    }}>
                      Current Drivers
                    </h3>
                    {team.drivers && team.drivers.$values && team.drivers.$values.length > 0 ? (
                      team.drivers.$values.map(driver => (
                        <div key={driver.id} style={{ color: '#666', marginBottom: '4px' }}>
                          {driver.firstName} {driver.lastName}
                        </div>
                      ))
                    ) : (
                      <div style={{ color: '#666', fontStyle: 'italic' }}>No drivers assigned</div>
                    )}
                  </div>

                  {/* Stats Placeholder */}
                  <div style={{
                    marginTop: '8px',
                    padding: '12px',
                    backgroundColor: '#f8f8f8',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    color: '#666'
                  }}>
                    Stats coming soon...
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TeamsPage; 