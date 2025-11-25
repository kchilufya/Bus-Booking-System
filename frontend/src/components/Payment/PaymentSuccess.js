import React from 'react';
import './PaymentSuccess.css';

const PaymentSuccess = ({ bookingDetails, onGoHome }) => {
    // Safely handle bookingDetails
    if (!bookingDetails) {
        return (
            <div className="success-container">
                <div className="success-card">
                    <h2>⚠️ No booking details found</h2>
                    <button onClick={onGoHome} className="btn btn-primary">
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const {
        route = 'N/A',
        busNumber = 'N/A',
        seats = [],
        passengerName = 'N/A',
        email = 'N/A',
        bookingId = 'N/A'
    } = bookingDetails;

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-icon">
                    <span className="checkmark">✓</span>
                </div>
                
                <h1>🎉 Booking Successful!</h1>
                <p className="success-message">
                    Your bus ticket has been booked successfully. 
                    A confirmation email has been sent to {email}
                </p>

                <div className="booking-details-section">
                    <h3>📋 Booking Details</h3>
                    
                    <div className="detail-row">
                        <span className="label">Booking ID:</span>
                        <span className="value booking-id">{bookingId}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Route:</span>
                        <span className="value">{route}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Bus Number:</span>
                        <span className="value">{busNumber}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Passenger:</span>
                        <span className="value">{passengerName}</span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Seat(s):</span>
                        <span className="value seats-list">
                            {seats.length > 0 ? seats.join(', ') : 'N/A'}
                        </span>
                    </div>

                    <div className="detail-row">
                        <span className="label">Email:</span>
                        <span className="value">{email}</span>
                    </div>
                </div>

                <div className="next-steps">
                    <h3>📌 Next Steps</h3>
                    <ul>
                        <li>Check your email for the e-ticket</li>
                        <li>Arrive 30 minutes before departure</li>
                        <li>Present your booking ID at the counter</li>
                        <li>Carry a valid ID for verification</li>
                    </ul>
                </div>

                <div className="action-buttons">
                    <button onClick={onGoHome} className="btn btn-primary btn-large">
                        🏠 Back to Home
                    </button>
                    <button 
                        onClick={() => window.print()} 
                        className="btn btn-outline btn-large"
                    >
                        🖨️ Print Ticket
                    </button>
                </div>

                <div className="support-info">
                    <p>Need help? Contact us:</p>
                    <p>📞 +260 XXX XXX XXX | 📧 support@zambianbus.com</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;