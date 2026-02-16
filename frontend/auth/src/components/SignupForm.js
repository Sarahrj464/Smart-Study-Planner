import React, { useState, useContext } from 'react';
import * as api from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function SignupForm({ onClose }) {
  const { setUser } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!name.trim()) return 'Name is required';
    if (!email.includes('@')) return 'Valid email required';
    if (password.length < 6) return 'Password must be at least 6 chars';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      const res = await api.signup(name, email, password);
      if (res.user) setUser(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
        <button className="button" disabled={loading}>{loading ? 'Signing up...' : 'Signup'}</button>
      </div>
    </form>
  );
}