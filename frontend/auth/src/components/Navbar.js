import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import * as api from '../api/auth';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogout() {
    setLoadingLogout(true);
    setError(null);
    try {
      await api.logout();
      setUser(null);
    } catch (err) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoadingLogout(false);
    }
  }

  return (
    <>
      <div className="navbar">
        <div style={{ fontWeight: 700 }}>Student Study</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <>
              <div>Welcome, {user.name}</div>
              <button className="button secondary" onClick={handleLogout} disabled={loadingLogout}>
                {loadingLogout ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <button className="button secondary" onClick={() => setShowLogin(true)}>Login</button>
              <button className="button" onClick={() => setShowSignup(true)}>Signup</button>
            </>
          )}
        </div>
      </div>

      <AuthModal visible={showLogin} title="Login" onClose={() => setShowLogin(false)}>
        <LoginForm onClose={() => setShowLogin(false)} />
      </AuthModal>

      <AuthModal visible={showSignup} title="Signup" onClose={() => setShowSignup(false)}>
        <SignupForm onClose={() => setShowSignup(false)} />
      </AuthModal>

      {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}
    </>
  );
}