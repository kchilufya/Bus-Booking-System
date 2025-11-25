import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyBookings.css';

const API_URL = 'http://localhost:5000/api';

const MyBookings = ({ onViewDetails }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, confirmed, cancelled, pending

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/bookings`);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Error loading bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/bookings/${bookingId}`);
            alert('Booking cancelled successfully!');
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Error cancelling booking: ' + (error.response?.data?.message || error.message));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'status-confirmed';
            case 'cancelled':
                return 'status-cancelled';
            case 'pending':
                return 'status-pending';
            case 'completed':
                return 'status-completed';
            default:
                return '';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.bookingStatus === filter;
    });

    if (loading) {
        return (
            <div className="my-bookings-container">
                <div className="loading">Loading bookings...</div>
            </div>
        );
    }

    return (
        <div className="my-bookings-container">
            <div className="bookings-header">
                <h2>📋 My Bookings</h2>
                <p>View and manage all your bus bookings</p>
            </div>

            <div className="bookings-filters">
                <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({bookings.length})
                </button>
                <button 
                    className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
                    onClick={() => setFilter('confirmed')}
                >
                    Confirmed ({bookings.filter(b => b.bookingStatus === 'confirmed').length})
                </button>
                <button 
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({bookings.filter(b => b.bookingStatus === 'pending').length})
                </button>
                <button 
                    className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
                    onClick={() => setFilter('cancelled')}
                >
                    Cancelled ({bookings.filter(b => b.bookingStatus === 'cancelled').length})
                </button>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="no-bookings">
                    <p>No bookings found</p>
                </div>
            ) : (
                <div className="bookings-grid">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="booking-card">
                            <div className="booking-card-header">
                                <span className={`status-badge ${getStatusColor(booking.bookingStatus)}`}>
                                    {booking.bookingStatus.toUpperCase()}
                                </span>
                                <span className="booking-id">#{booking._id.slice(-6)}</span>
                            </div>

                            <div className="booking-card-body">
                                <div className="route-info">
                                    <h3>
                                        {booking.routeId?.startLocation || 'N/A'} 
                                        <span className="arrow">→</span> 
                                        {booking.routeId?.destination || 'N/A'}
                                    </h3>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <span className="icon">🚌</span>
                                        <span>Bus: {booking.busId?.busNumber || 'N/A'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">🪑</span>
                                        <span>Seats: {booking.seats.join(', ')}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">👤</span>
                                        <span>{booking.passengerName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">💰</span>
                                        <span className="amount">K{booking.totalAmount}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="icon">📅</span>
                                        <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="payment-status">
                                    Payment: <span className={booking.paymentStatus === 'paid' ? 'paid' : 'unpaid'}>
                                        {booking.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div className="booking-card-actions">
                                <button 
                                    className="btn btn-outline btn-small"
                                    onClick={() => onViewDetails(booking)}
                                >
                                    View Details
                                </button>
                                {booking.bookingStatus !== 'cancelled' && (
                                    <button 
                                        className="btn btn-danger btn-small"
                                        onClick={() => handleCancelBooking(booking._id)}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;