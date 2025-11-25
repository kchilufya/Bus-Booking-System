import React from 'react';
import './RouteList.css';

const RouteList = ({ routes, onSelectRoute, loading }) => {
    if (loading) {
        return <div className="loading">Loading routes...</div>;
    }

    if (routes.length === 0) {
        return <div className="no-routes">No routes available</div>;
    }

    return (
        <div className="route-list-container">
            <h2>🗺️ Available Routes</h2>
            <div className="routes-grid">
                {routes.map((route) => (
                    <div key={route._id} className="route-card">
                        <div className="route-header">
                            <h3>{route.startLocation}</h3>
                            <span className="arrow">→</span>
                            <h3>{route.destination}</h3>
                        </div>
                        
                        <div className="route-details">
                            <div className="detail-item">
                                <span className="icon">📏</span>
                                <span>{route.distance} km</span>
                            </div>
                            <div className="detail-item">
                                <span className="icon">⏱️</span>
                                <span>{route.duration}</span>
                            </div>
                            <div className="detail-item">
                                <span className="icon">💰</span>
                                <span className="price">K{route.fare}</span>
                            </div>
                        </div>

                        <button 
                            className="btn btn-primary"
                            onClick={() => onSelectRoute(route)}
                        >
                            Book this Route
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RouteList;