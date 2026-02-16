Integration notes - backend timetable builder

1) Mount routes in your main backend server (e.g., /backend/auth/server.js):
   const timetableRoutes = require('../timetable-builder/routes/timetable');
   app.use('/api/timetable', timetableRoutes);

   Ensure this is after cookieParser and auth middleware are available.

2) The routes use the existing auth middleware from /backend/auth/middleware/auth which expects the JWT in an httpOnly cookie.

3) Timetable data model:
   - Timetable has a 'columns' array. Each column contains day (e.g., "Mon") and items array.
   - Items have id, title, start, end, location, color.

4) No extra backend dependencies required beyond express-validator and mongoose (already in project).