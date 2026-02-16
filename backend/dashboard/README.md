Integration notes - backend dashboard
1) Mount the dashboard routes in your server (server.js under /backend/auth):
   const dashboardRoutes = require('../dashboard/routes/dashboard');
   app.use('/api/dashboard', dashboardRoutes);

   Place these two lines after your auth routes are mounted or alongside them.

2) StudySession model stores per-user sessions. You do not need to change the existing auth User schema for permissions to work,
   but to assign admins you can set a 'role' field on User documents manually (e.g., via Mongo shell):
     db.users.updateOne({ email: 'admin@example.com' }, { $set: { role: 'admin' } })

   The role middleware treats missing role as 'student'.

3) Required dependencies: none additional for backend (uses existing mongoose). Make sure backend has access to the auth/User model path:
   The routes assume the project structure where /backend/auth and /backend/dashboard are siblings.

4) Endpoints:
   - POST /api/dashboard/session { durationMinutes, focusedPercent, date? } (auth)
   - GET /api/dashboard/analytics?days=30 (auth)
   - GET /api/dashboard/admin/overview (auth, admin)