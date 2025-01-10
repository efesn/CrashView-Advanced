import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = localStorage.getItem('username');
    if (userLoggedIn && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
  
    checkIsMobile();
    checkLoginStatus();
    
    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('loginStateChange', checkLoginStatus);
  
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
  
    // Clear all localStorage items
    localStorage.clear();
  
    // Update state variables
    setIsLoggedIn(false);
    setUsername('');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#C40500', color: 'white' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 'light', fontSize: '1.25rem', textDecoration: 'none', color: 'white' }}>
              CrashView
            </Link>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NavLink to="/crashes">Crashes</NavLink>
              <NavLink to="/drivers">Drivers</NavLink>
              <NavLink to="/teams">Teams</NavLink>
              <NavLink to="/about">About Us</NavLink>
              <NavLink to="/features">Features</NavLink>
              {isLoggedIn && username ? (
                <>
                  <NavLink to="/profile">{username}'s Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup" style={{ backgroundColor: 'white', color: '#C40500' }}>Sign Up</NavLink>
                </>
              )}
            </div>
          )}
          {isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isOpen ? (
                <svg style={{ display: 'block', height: '1.5rem', width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg style={{ display: 'block', height: '1.5rem', width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {isMobile && isOpen && (
        <div>
          <div style={{ padding: '0.5rem' }}>
            <MobileNavLink to="/crashes">Crashes</MobileNavLink>
            <MobileNavLink to="/drivers">Drivers</MobileNavLink>
            <MobileNavLink to="/teams">Teams</MobileNavLink>
            <MobileNavLink to="/about">About Us</MobileNavLink>
            <MobileNavLink to="/features">Features</MobileNavLink>
            {isLoggedIn && username ? (
              <>
                <MobileNavLink to="/profile">{username}'s Profile</MobileNavLink>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login">Login</MobileNavLink>
                <MobileNavLink to="/signup" style={{ backgroundColor: 'white', color: '#C40500' }}>Sign Up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, style }) => (
  <Link
    to={to}
    style={{
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      textDecoration: 'none',
      color: 'white',
      ...style
    }}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, style }) => (
  <Link
    to={to}
    style={{
      display: 'block',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontWeight: '500',
      textDecoration: 'none',
      color: 'white',
      ...style
    }}
  >
    {children}
  </Link>
);

export default Navbar;
