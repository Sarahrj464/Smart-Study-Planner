Integration notes - frontend dashboard

1) Install chart dependencies in the main frontend project (where your /frontend/auth lives):
   cd frontend/auth
   npm install chart.js react-chartjs-2

   Alternatively, if using the separate folder approach:
   cd frontend/dashboard
   npm install

2) Usage:
   - Import the Dashboard component into your main React App (e.g., /frontend/auth/src/App.js)
     import Dashboard from '../../dashboard/src/components/Dashboard';
     Then render <Dashboard /> inside AuthProvider so that it can read user from AuthContext.

   - The component expects AuthContext (AuthProvider) from your existing auth code to be available.
     The Dashboard calls backend endpoints:
       GET /api/dashboard/analytics?days=30
       POST /api/dashboard/session
       GET /api/dashboard/admin/overview  (admin only)

3) Ensure frontend .env REACT_APP_API_URL points to your backend (default http://localhost:5000)

4) Notes:
   - The Dashboard component includes a small "Add dummy session" button to quickly add sample data.
   - Admin UI is shown when authenticated user has user.role === 'admin'.