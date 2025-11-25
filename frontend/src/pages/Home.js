import React, { useState, useEffect } from 'react';

const Home = ({ onRouteSelect }) => {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [routesResponse, busesResponse] = await Promise.all([
        fetch('http://localhost:5000/api/routes'),
        fetch('http://localhost:5000/api/buses')
      ]);

      const routesData = await routesResponse.json();
      const busesData = await busesResponse.json();

      setRoutes(routesData);
      setBuses(busesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <h2>Welcome to Zambian Bus Booking System</h2>
        <p className="hero-text">
          Skip the long queues at bus stations! Book your bus tickets online 
          and travel comfortably across Zambia. Fast, easy, and secure booking.
        </p>
        
        <div className="cta-buttons">
          <button 
            className="btn btn-primary" 
            onClick={() => document.getElementById('routes-section').scrollIntoView()}
          >
            Book Your Ticket Now
          </button>
        </div>
      </section>

      <section className="features-section">
        <h3>Why Choose Our Bus Booking System?</h3>
        <div className="features-grid">
          <div className="feature-card">
            <h4>🕐 Save Time</h4>
            <p>No more waiting in long queues at bus stations</p>
          </div>
          <div className="feature-card">
            <h4>💺 Choose Your Seat</h4>
            <p>Select your preferred seat in advance</p>
          </div>
          <div className="feature-card">
            <h4>📱 Mobile Money</h4>
            <p>Pay easily with Mobile Money or card</p>
          </div>
          <div className="feature-card">
            <h4>🎫 Instant Tickets</h4>
            <p>Get your tickets immediately after booking</p>
          </div>
        </div>
      </section>

      <section id="routes-section" className="routes-preview">
        <h3>Available Routes - Click to Book</h3>
        {loading ? (
          <p>Loading routes...</p>
        ) : routes.length > 0 ? (
          <div className="routes-list">
            {routes.map((route) => (
              <div key={route._id} className="route-preview-card clickable" onClick={() => onRouteSelect(route)}>
                <h4>{route.startLocation} → {route.destination}</h4>
                <div className="route-details">
                  <span>📍 {route.distance} km</span>
                  <span>⏱️ {route.duration}</span>
                </div>
                <button className="btn btn-small">
                  Book This Route
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No routes available at the moment.</p>
        )}
      </section>

      {buses.length > 0 && (
        <section className="stats-section">
          <h3>Our Fleet</h3>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">{buses.length}</span>
              <span className="stat-label">Active Buses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{routes.length}</span>
              <span className="stat-label">Routes Available</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{buses.reduce((total, bus) => total + bus.capacity, 0)}</span>
              <span className="stat-label">Total Seats</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;