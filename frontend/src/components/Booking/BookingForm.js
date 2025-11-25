import React, { useState } from 'react';
import './BookingForm.css';

const BookingForm = ({ selectedRoute, selectedBus, selectedSeats, onComplete, onRequireAuth }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    idNumber: ''
  });
  const [loading, setLoading] = useState(false);

  // Guard: ensure required props exist
  if (!selectedRoute || !selectedBus || !Array.isArray(selectedSeats)) {
    return <div className="booking-loading"><p>Loading booking details...</p></div>;
  }

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in required fields');
      return;
    }

    const token = localStorage.getItem('userToken');
    if (!token) {
      alert('Please sign in or register before booking.');
      onRequireAuth && onRequireAuth();
      return;
    }

    setLoading(true);
    const bookingData = {
      passengerName: formData.name,
      passengerEmail: formData.email,
      passengerPhone: formData.phone,
      idNumber: formData.idNumber,
      routeId: selectedRoute._id || selectedRoute.id,
      busId: selectedBus._id || selectedBus.id,
      seats: selectedSeats,
      totalAmount: selectedSeats.length * (selectedBus?.fare || selectedRoute?.fare || 150)
    };

    console.log('Booking submit -> URL:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`, 'token:', token);

    try {
      const res = await fetch(`${API}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      if (res.status === 401) {
        // token missing/expired/invalid
        alert('Session expired or not authorized. Please sign in again.');
        localStorage.removeItem('userToken');
        onRequireAuth && onRequireAuth();
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Booking failed' }));
        throw new Error(err.message || 'Booking failed');
      }

      const result = await res.json();
      onComplete && onComplete(result);
    } catch (err) {
      console.error('Booking error:', err);
      alert(err.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const totalAmount = selectedSeats.length * (selectedBus?.fare || selectedRoute?.fare || 150);

  return (
    <div className="booking-form-container">
      <div className="booking-header">
        <h2>Complete Your Booking</h2>
      </div>

      <div className="booking-summary-card">
        <h3>Booking Summary</h3>
        <div>{selectedRoute.startLocation} → {selectedRoute.destination}</div>
        <div>Bus: {selectedBus.busNumber}</div>
        <div>Seats: {selectedSeats.join(', ')}</div>
        <div>Total: K{totalAmount}</div>
      </div>

      <form onSubmit={handleSubmit} className="passenger-form">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" required />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        <input name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="NRC/Passport (optional)" />
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;