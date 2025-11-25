import React, { useState, useEffect, useCallback } from 'react';
import './SeatSelection.css';

const SeatSelection = ({ busId, onSeatSelect, onBack }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [busDetails, setBusDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBusDetails = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/buses/${busId}`);
            const data = await response.json();
            setBusDetails(data);
            
            // Generate seats based on seat configuration
            const seatArray = data.seatConfiguration.map(seatConfig => ({
                number: seatConfig.seatNumber,
                type: seatConfig.type,
                price: seatConfig.price,
                isBooked: false // TODO: Fetch actual booking status
            }));
            
            setSeats(seatArray);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bus details:', error);
            setLoading(false);
        }
    }, [busId]);

    useEffect(() => {
        fetchBusDetails();
    }, [fetchBusDetails]);

    const toggleSeat = (seatNumber) => {
        const seat = seats.find(s => s.number === seatNumber);
        if (seat.isBooked) return;

        if (selectedSeats.includes(seatNumber)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
        } else {
            setSelectedSeats([...selectedSeats, seatNumber]);
        }
    };

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }
        onSeatSelect(selectedSeats);
    };

    const getSeatClass = (seat) => {
        let className = `seat seat-${seat.type}`;
        if (seat.isBooked) className += ' booked';
        if (selectedSeats.includes(seat.number)) className += ' selected';
        return className;
    };

    const getSeatIcon = (type) => {
        switch(type) {
            case 'window':
                return '🪟';
            case 'aisle':
                return '🪑';
            default:
                return '🪑';
        }
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seatNum) => {
            const seat = seats.find(s => s.number === seatNum);
            return total + (seat ? seat.price : 0);
        }, 0);
    };

    // Get the standard fare from the first seat (all seats have same price)
    const standardFare = seats.length > 0 ? seats[0].price : 0;

    if (loading) {
        return <div className="loading">Loading seats...</div>;
    }

    return (
        <div className="seat-selection-container">
            <div className="seat-selection-header">
                <button onClick={onBack} className="btn btn-outline">
                    ← Back to Buses
                </button>
                <h2>Select Your Seats</h2>
                <p>Bus {busDetails?.busNumber} - All seats K{standardFare}</p>
            </div>

            <div className="legend">
                <div className="legend-item">
                    <span className="seat seat-window">🪟</span>
                    <span>Window Seat</span>
                </div>
                <div className="legend-item">
                    <span className="seat seat-aisle">🪑</span>
                    <span>Aisle Seat</span>
                </div>
                <div className="legend-item">
                    <span className="seat selected">✓</span>
                    <span>Selected</span>
                </div>
                <div className="legend-item">
                    <span className="seat booked">✕</span>
                    <span>Booked</span>
                </div>
                <div className="legend-item standard-fare">
                    <span className="fare-label">💰 Standard Fare:</span>
                    <span className="fare-value">K{standardFare} per seat</span>
                </div>
            </div>

            <div className="bus-layout">
                <div className="driver-section">
                    <div className="steering-wheel">🚗</div>
                    <span>Driver</span>
                </div>

                <div className="seats-grid">
                    {seats.map((seat) => (
                        <div
                            key={seat.number}
                            className={getSeatClass(seat)}
                            onClick={() => toggleSeat(seat.number)}
                        >
                            <span className="seat-icon">{getSeatIcon(seat.type)}</span>
                            <span className="seat-number">{seat.number}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="selection-summary">
                <div className="summary-content">
                    <div className="selected-info">
                        <h3>Selected Seats: {selectedSeats.length}</h3>
                        {selectedSeats.length > 0 && (
                            <div className="selected-seats-list">
                                {selectedSeats.map(seatNum => {
                                    const seat = seats.find(s => s.number === seatNum);
                                    return (
                                        <span key={seatNum} className="selected-seat-tag">
                                            {getSeatIcon(seat.type)} Seat {seatNum}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="total-amount">
                        <h3>Total: K{calculateTotal()}</h3>
                        <p className="fare-breakdown">
                            {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} × K{standardFare}
                        </p>
                    </div>
                </div>
                <button 
                    className="btn btn-primary btn-large" 
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                >
                    Continue to Booking ({selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''})
                </button>
            </div>
        </div>
    );
};

export default SeatSelection;