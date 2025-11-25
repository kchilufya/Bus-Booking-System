import React from 'react';
import './BusList.css';

const BusList = ({ buses, onSelectBus }) => {
    if (buses.length === 0) {
        return (
            <div className="no-buses">
                <p>No buses available for this route</p>
            </div>
        );
    }

    return (
        <div className="bus-list-container">
            <div className="buses-grid">
                {buses.map((bus) => (
                    <div key={bus._id} className="bus-card">
                        <div className="bus-header">
                            <h3>🚌 {bus.busNumber}</h3>
                            <span className={`status-badge ${bus.status}`}>
                                {bus.status}
                            </span>
                        </div>

                        <div className="bus-route-info">
                            <div className="route-endpoints">
                                <div className="endpoint">
                                    <span className="time">{bus.departureTime}</span>
                                    <span className="location">{bus.routeId?.startLocation}</span>
                                </div>
                                <div className="route-line">
                                    <div className="line"></div>
                                    <span className="duration">{bus.routeId?.duration}</span>
                                </div>
                                <div className="endpoint">
                                    <span className="time">{bus.arrivalTime}</span>
                                    <span className="location">{bus.routeId?.destination}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bus-details">
                            <div className="detail-row">
                                <span className="label">Total Seats:</span>
                                <span className="value">{bus.capacity}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Available:</span>
                                <span className="value available">{bus.availableSeats}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Base Fare:</span>
                                <span className="value price">K{bus.routeId?.fare}</span>
                            </div>
                        </div>

                        <div className="seat-types-info">
                            <div className="seat-type">
                                <span>👑 VIP</span>
                                <span className="type-price">K200</span>
                            </div>
                            <div className="seat-type">
                                <span>🪟 Window</span>
                                <span className="type-price">K{bus.routeId?.fare || 150}</span>
                            </div>
                            <div className="seat-type">
                                <span>🪑 Aisle</span>
                                <span className="type-price">K{bus.routeId?.fare || 150}</span>
                            </div>
                        </div>

                        <button 
                            className="btn btn-primary"
                            onClick={() => onSelectBus(bus)}
                            disabled={bus.availableSeats === 0}
                        >
                            {bus.availableSeats > 0 ? 'Select Bus' : 'Fully Booked'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BusList;