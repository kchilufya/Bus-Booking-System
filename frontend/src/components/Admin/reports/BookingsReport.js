import React, { useEffect, useState } from 'react';

const BookingsReport = ({ token }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/admin/reports/bookings', {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        const data = await res.json();
        setRows(data || []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchBookings();
  }, [token]);

  if (loading) return <div>Loading bookings...</div>;
  if (!rows.length) return <div>No bookings found</div>;

  return (
    <div>
      <table className="report-table">
        <thead>
          <tr><th>Booking ID</th><th>Route</th><th>Bus</th><th>Seats</th><th>Amount (K)</th><th>Status</th><th>Date</th></tr>
        </thead>
        <tbody>
          {rows.map(b => (
            <tr key={b._id}>
              <td>{b._id}</td>
              <td>{b.routeId?.startLocation} → {b.routeId?.destination}</td>
              <td>{b.busId?.busNumber}</td>
              <td>{(b.seats || []).join(', ')}</td>
              <td>{b.totalAmount}</td>
              <td>{b.paymentStatus}</td>
              <td>{new Date(b.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsReport;