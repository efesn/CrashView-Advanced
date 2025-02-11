import React from 'react';

function AboutPage() {
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    header: {
      marginBottom: '48px',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5rem',
      color: '#111',
      marginBottom: '16px',
      fontWeight: '700'
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#666',
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    section: {
      marginBottom: '48px',
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    sectionTitle: {
      fontSize: '1.75rem',
      color: '#C40500',
      marginBottom: '24px',
      fontWeight: '600'
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginTop: '32px'
    },
    featureCard: {
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      padding: '24px',
      textAlign: 'center'
    },
    featureIcon: {
      fontSize: '2rem',
      marginBottom: '16px'
    },
    featureTitle: {
      fontSize: '1.25rem',
      color: '#111',
      marginBottom: '12px',
      fontWeight: '600'
    },
    featureDescription: {
      color: '#666',
      lineHeight: '1.5'
    },
    paragraph: {
      color: '#444',
      lineHeight: '1.8',
      marginBottom: '16px',
      fontSize: '1.1rem'
    },
    highlight: {
      backgroundColor: '#C40500',
      color: 'white',
      padding: '32px',
      borderRadius: '12px',
      marginTop: '48px',
      textAlign: 'center'
    },
    highlightText: {
      fontSize: '1.5rem',
      fontWeight: '500',
      marginBottom: '16px'
    },
    highlightSubtext: {
      fontSize: '1.1rem',
      opacity: '0.9'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to CrashView</h1>
        <p style={styles.subtitle}>
        Your go-to place for analyzing and discussing Formula 1 crashes!
        </p>
      </header>

      {/* Mission Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Mission</h2>
        <p style={styles.paragraph}>
        At CrashView, we're all about giving Formula 1 fans a place to break down and discuss the biggest racing moments.
        Whether it's a dramatic crash, a tight on-track battle, or a controversial decision, we believe every incident deserves a closer look.
        </p>
        <p style={styles.paragraph}>
        CrashView is built for F1 enthusiasts who love analyzing the sport’s most intense moments.
        Here, you can explore key incidents, share your thoughts, and connect with others who are just as passionate about the details that shape every race.
        </p>
      </section>

      {/* Features Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Key Features</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎥</div>
            <h3 style={styles.featureTitle}>Crash Analysis</h3>
            <p style={styles.featureDescription}>
              High-quality video footage of crashes and incidents from multiple angles
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureTitle}>Community Discussion</h3>
            <p style={styles.featureDescription}>
              Engage in meaningful debates about racing incidents with fellow fans
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Interactive Polls</h3>
            <p style={styles.featureDescription}>
              Vote and see what others think about controversial racing moments
            </p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏎️</div>
            <h3 style={styles.featureTitle}>Driver Profiles</h3>
            <p style={styles.featureDescription}>
              Detailed information about F1 drivers and their stats about their crash history
            </p>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Community</h2>
        <p style={styles.paragraph}>
          CrashView is more than just a website – it's a thriving community of Formula 1 enthusiasts. From casual fans 
          to hardcore analysts, our platform welcomes everyone who wants to understand the technical, strategic, and 
          competitive aspects of F1 racing incidents.
        </p>
        <p style={styles.paragraph}>
          We encourage respectful debate, technical analysis, and the sharing of knowledge. Our community guidelines 
          ensure that discussions remain constructive and informative, making CrashView a valuable resource for F1 fans 
          worldwide.
        </p>
      </section>

      {/* Call to Action */}
      <div style={styles.highlight}>
        <h3 style={styles.highlightText}>Join the Discussion Today</h3>
        <p style={styles.highlightSubtext}>
          Become part of our growing community and contribute to the analysis of F1's most talked-about moments
        </p>
      </div>
    </div>
  );
}

export default AboutPage; 