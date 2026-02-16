import React from 'react';
import { createRoot } from 'react-dom/client';
import TimetableBuilder from './components/TimetableBuilder';
import '../../../auth/src/index.css'; // reuse auth styles or Tailwind build as needed
import { AuthProvider } from '../../../auth/src/context/AuthContext'; // adjust import path if needed

createRoot(document.getElementById('root') || document.body.appendChild(document.createElement('div'))).render(
  <AuthProvider>
    <TimetableBuilder />
  </AuthProvider>
);