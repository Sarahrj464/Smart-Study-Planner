import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';

function Home() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="card">
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p>You're logged in as <strong>{user.email}</strong>.</p>
          <p>Start creating study groups and notes!</p>
        </div>
      ) : (
        <div>
          <p>You are not logged in. Use the buttons above to login or signup.</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="container">
        <Navbar />
        <Home />
      </div>
    </AuthProvider>
  );
}