import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('/api/bookings'); // Adjust the endpoint as necessary
                setBookings(response.data);
            } catch (error) {
                console.error('Error fetching booking history:', error);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h1>Booking History</h1>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            <p>Bus ID: {booking.busId}</p>
                            <p>Seat Number: {booking.seatNumber}</p>
                            <p>Status: {booking.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingHistory;