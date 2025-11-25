import React from 'react';
import './BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose, onPrint }) => {
    if (!booking) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>🎫 Booking Details</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="ticket-section">
                        <div className="ticket-header">
                            <h3>E-Ticket</h3>
                            <span className={`status-badge status-${booking.bookingStatus}`}>
                                {booking.bookingStatus.toUpperCase()}
                            </span>
                        </div>

                        <div className="ticket-info">
                            <div className="info-row">
                                <span className="label">Booking ID:</span>
                                <span className="value">{booking._id}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Booking Date:</span>
                                <span className="value">{new Date(booking.createdAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="journey-section">
                            <h4>Journey Details</h4>
                            <div className="journey-route">
                                <div className="location">
                                    <span className="location-name">{booking.routeId?.startLocation}</span>
                                    <span className="time">{booking.busId?.departureTime}</span>
                                </div>
                                <div className="journey-line">
                                    <div className="line"></div>
                                    <span className="duration">{booking.routeId?.duration}</span>
                                </div>
                                <div className="location">
                                    <span className="location-name">{booking.routeId?.destination}</span>
                                    <span className="time">{booking.busId?.arrivalTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="passenger-section">
                            <h4>Passenger Information</h4>
                            <div className="info-row">
                                <span className="label">Name:</span>
                                <span className="value">{booking.passengerName}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Email:</span>
                                <span className="value">{booking.passengerEmail}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Phone:</span>
                                <span className="value">{booking.passengerPhone}</span>
                            </div>
                        </div>

                        <div className="bus-section">
                            <h4>Bus Information</h4>
                            <div className="info-row">
                                <span className="label">Bus Number:</span>
                                <span className="value">{booking.busId?.busNumber}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Seat Numbers:</span>
                                <span className="value seats">{booking.seats.join(', ')}</span>
                            </div>
                        </div>

                        <div className="payment-section">
                            <div className="info-row total">
                                <span className="label">Total Amount:</span>
                                <span className="value amount">K{booking.totalAmount}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Payment Status:</span>
                                <span className={`value ${booking.paymentStatus}`}>
                                    {booking.paymentStatus.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="instructions">
                        <h4>📝 Important Instructions</h4>
                        <ul>
                            <li>Arrive at the bus station 30 minutes before departure</li>
                            <li>Present this ticket at the boarding counter</li>
                            <li>Carry a valid ID for verification</li>
                            <li>Ensure you board the correct bus number</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={() => onPrint(booking)}>
                        🖨️ Print Ticket
                    </button>
                    <button className="btn btn-outline" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;