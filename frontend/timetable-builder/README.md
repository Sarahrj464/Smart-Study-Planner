Integration notes - frontend timetable builder

1) Install dependencies:
   - cd frontend/timetable-builder
   - npm install

2) Tailwind:
   - This package includes Tailwind config. In a monorepo setup, you can also add Tailwind to your main frontend project and reuse styles.
   - For quick usage, ensure the main app builds Tailwind CSS from src/index.css (postcss + tailwindcss). Example: npx tailwindcss -i ./src/index.css -o ./src/tailwind.css --watch

3) Usage:
   - Import the TimetableBuilder component into your main app (where AuthProvider is available):
     import TimetableBuilder from '../../timetable-builder/src/components/TimetableBuilder';
     ...
     <AuthProvider>
       <TimetableBuilder />
     </AuthProvider>

4) Notes:
   - Drag-and-drop uses react-beautiful-dnd. Items have client-generated UUIDs.
   - The builder supports adding items by prompts (simple UX). You can replace prompts with a dedicated modal form if you prefer.
   - All API calls include credentials so the backend httpOnly JWT cookie will be sent.