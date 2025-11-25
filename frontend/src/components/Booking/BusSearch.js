import React, { useState, useEffect } from 'react';

const BusSearch = ({ selectedRoute, onBusSelect, onBack }) => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusesForRoute();
  }, [selectedRoute]);

  const fetchBusesForRoute = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/buses');
      const allBuses = await response.json();

      // Filter buses by route (you might need to populate route in your backend)
      const routeBuses = allBuses.filter(bus => bus.route === selectedRoute._id);
      setBuses(routeBuses.length > 0 ? routeBuses : allBuses.slice(0, 2)); // Show some buses for demo
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading available buses...</div>;
  }

  return (
    <div className="bus-search-container">
      <div className="page-header">
        <button onClick={onBack} className="btn btn-outline">← Back to Routes</button>
        <h2>Available Buses</h2>
        <div className="route-info">
          <h3>{selectedRoute.startLocation} → {selectedRoute.destination}</h3>
          <p>Distance: {selectedRoute.distance} km | Duration: {selectedRoute.duration}</p>
        </div>
      </div>

      <div className="buses-list">
        {buses.length > 0 ? (
          buses.map((bus) => (
            <div key={bus._id} className="bus-item">
              <div className="bus-details">
                <h4>Bus {bus.busNumber}</h4>
                <div className="bus-info">
                  <span>🚌 Capacity: {bus.capacity} seats</span>
                  <span>💺 Available: {bus.availableSeats} seats</span>
                  <span>💰 Price: K150 per seat</span>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => onBusSelect(bus)}
                disabled={bus.availableSeats === 0}
              >
                {bus.availableSeats > 0 ? 'Select Seats' : 'Fully Booked'}
              </button>
            </div>
          ))
        ) : (
          <div className="no-buses">
            <p>No buses available for this route at the moment.</p>
            <button onClick={onBack} className="btn btn-outline">Choose Different Route</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusSearch;