import React, { useEffect, useState } from 'react';

const RevenueReport = ({ token, compact = false }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;
        const res = await fetch('http://localhost:5000/api/admin/reports/revenue', { headers });
        const data = await res.json();
        setRows(data || []);
      } catch (e) {
        console.error(e);
      } finally { setLoading(false); }
    };
    fetchReport();
  }, [token]);

  const escapeCsv = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes('"') || str.includes(',') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExport = () => {
    if (!rows || rows.length === 0) return;
    const header = ['Route', 'Revenue (K)', 'Bookings'];
    const csvRows = [header.join(',')];
    rows.forEach(r => {
      const line = [
        escapeCsv(r.routeName),
        escapeCsv(r.totalRevenue),
        escapeCsv(r.bookingsCount)
      ];
      csvRows.push(line.join(','));
    });
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const filename = `revenue-report-${now.toISOString().slice(0,10)}.csv`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading revenue...</div>;
  if (!rows.length) return <div>No revenue data</div>;

  return (
    <div>
      {!compact && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button className="btn btn-outline" onClick={handleExport}>Export CSV</button>
        </div>
      )}

      {compact ? (
        <div>
          {rows.slice(0,3).map(r => (
            <div key={r._id} style={{marginBottom:8}}>
              <strong>{r.routeName}</strong>: K{r.totalRevenue} ({r.bookingsCount} bookings)
            </div>
          ))}
        </div>
      ) : (
        <table className="report-table">
          <thead>
            <tr><th>Route</th><th>Revenue (K)</th><th>Bookings</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td>{r.routeName}</td>
                <td>{r.totalRevenue}</td>
                <td>{r.bookingsCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RevenueReport;