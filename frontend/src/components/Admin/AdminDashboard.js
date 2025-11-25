import React, { useState } from 'react';
import RevenueReport from './reports/RevenueReport';
import BookingsReport from './reports/BookingsReport';
import PopularRoutes from './reports/PopularRoutes';
import './Admin.css';

const AdminDashboard = ({ token, onLogout }) => {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Admin Reports</h2>
        <div>
          <button className="btn btn-outline" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`tab ${tab==='dashboard'?'active':''}`} onClick={() => setTab('dashboard')}>Overview</button>
        <button className={`tab ${tab==='revenue'?'active':''}`} onClick={() => setTab('revenue')}>Revenue</button>
        <button className={`tab ${tab==='bookings'?'active':''}`} onClick={() => setTab('bookings')}>Bookings</button>
        <button className={`tab ${tab==='popular'?'active':''}`} onClick={() => setTab('popular')}>Popular Routes</button>
      </div>

      <div className="admin-content">
        {tab === 'dashboard' && <RevenueReport token={token} compact />}
        {tab === 'revenue' && <RevenueReport token={token} />}
        {tab === 'bookings' && <BookingsReport token={token} />}
        {tab === 'popular' && <PopularRoutes token={token} />}
      </div>
    </div>
  );
};

export default AdminDashboard;