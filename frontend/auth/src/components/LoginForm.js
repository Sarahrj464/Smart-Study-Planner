import React, { useState, useContext } from 'react';
import * as api from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function LoginForm({ onClose }) {
  const { setUser, reloadUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      // server sets httpOnly cookie. We update context from response
      if (res.user) setUser(res.user);
      else await reloadUser();
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <button className="button" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </div>
    </form>
  );
}