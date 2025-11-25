import React, { useState, useRef, useEffect } from 'react';
import './Auth.css';

const UserRegister = ({ onRegister, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(false);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!mountedRef.current) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      localStorage.setItem('userToken', data.token);
      if (mountedRef.current) onRegister(data.token);
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h3>Create account</h3>
      <form onSubmit={submit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone (optional)" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
        {error && <div className="error">{error}</div>}
        <div className="auth-actions">
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserRegister;