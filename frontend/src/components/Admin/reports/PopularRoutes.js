import React, { useEffect, useState } from 'react';

const PopularRoutes = ({ token }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/admin/reports/popular-routes', {
          headers: { Authorization: token ? `Bearer ${token}` : undefined }
        });
        const data = await res.json();
        setRows(data || []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchPopular();
  }, [token]);

  if (loading) return <div>Loading popular routes...</div>;
  if (!rows.length) return <div>No data</div>;

  return (
    <div>
      <ol>
        {rows.map(r => (
          <li key={r.routeName}>
            <strong>{r.routeName}</strong> — {r.bookingsCount} bookings, K{r.totalRevenue}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default PopularRoutes;