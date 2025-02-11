import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Driver photo mapping
const driverPhotos = {
  'Max Verstappen': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/2col/image.png',
  'Sergio Perez': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png.transform/2col/image.png',
  'Lewis Hamilton': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png.transform/2col/image.png',
  'George Russell': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png.transform/2col/image.png',
  'Charles Leclerc': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png.transform/2col/image.png',
  'Carlos Sainz': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png.transform/2col/image.png',
  'Lando Norris': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png.transform/2col/image.png',
  'Oscar Piastri': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png.transform/2col/image.png',
  'Fernando Alonso': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png.transform/2col/image.png',
  'Lance Stroll': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png.transform/2col/image.png',
  'Pierre Gasly': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png.transform/2col/image.png',
  'Esteban Ocon': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png.transform/2col/image.png',
  'Alexander Albon': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png.transform/2col/image.png',
  'Logan Sargeant': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png.transform/2col/image.png',
  'Yuki Tsunoda': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png.transform/2col/image.png',
  'Daniel Ricciardo': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png.transform/2col/image.png',
  'Valtteri Bottas': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png.transform/2col/image.png',
  'Guanyu Zhou': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png.transform/2col/image.png',
  'Kevin Magnussen': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png.transform/2col/image.png',
  'Nico Hulkenberg': 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png.transform/2col/image.png'
};

// Function to get driver photo
const getDriverPhoto = (firstName, lastName) => {
  const fullName = `${firstName} ${lastName}`;
  return driverPhotos[fullName] || 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/driver_fallback_image.png.transform/2col/image.png';
};

function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        Loading drivers...
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
        F1 Drivers
      </h1>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        padding: '12px 0'
      }}>
        {drivers.map(driver => (
          <div
            key={driver.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              border: '1px solid #eee',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer',
              ':hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            {/* Driver Photo */}
            <div style={{
              height: '320px',
              backgroundColor: driver.team?.color || '#f0f0f0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <img
                src={getDriverPhoto(driver.firstName, driver.lastName)}
                alt={`${driver.firstName} ${driver.lastName}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center'
                }}
                onError={(e) => {
                  e.target.src = 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/driver_fallback_image.png.transform/2col/image.png';
                }}
              />
            </div>

            {/* Driver Info */}
            <div style={{ padding: '20px' }}>
              <h2 style={{ 
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#111'
              }}>
                {driver.firstName} {driver.lastName}
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666'
                }}>
                  <span style={{ fontWeight: '500' }}>Team:</span>
                  <span style={{ marginLeft: '8px' }}>{driver.team?.name || 'No Team'}</span>
                </div>

                {/* Stats Placeholder */}
                <div style={{
                  marginTop: '12px',
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
        ))}
      </div>
    </div>
  );
}

export default DriversPage; 