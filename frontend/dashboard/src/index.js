// Example: how to import and render Dashboard inside your existing frontend app.
// You typically don't run this separate app — instead import Dashboard component into your main App.
// Example usage inside /frontend/auth/src/App.js:
//
// import Dashboard from '../../dashboard/src/components/Dashboard';
// ...
//
// <AuthProvider>
//   <Navbar />
//   <Dashboard />
// </AuthProvider>
//
// The path depends on your repo layout. If you prefer a standalone small app, you can render here.

import React from 'react';
import { createRoot } from 'react-dom/client';
import Dashboard from './components/Dashboard';
import { AuthProvider } from '../../../auth/src/context/AuthContext'; // adjust path if needed
import '../../../auth/src/index.css'; // reuse existing styles

createRoot(document.getElementById('root') || document.body.appendChild(document.createElement('div'))).render(
  <AuthProvider>
    <div style={{ maxWidth: 1000, margin: 20 }}>
      <Dashboard />
    </div>
  </AuthProvider>
);