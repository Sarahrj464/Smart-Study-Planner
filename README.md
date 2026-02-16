## 🚀 Quick Start

To start the application and open it automatically in your browser:

1. Double-click the `start_app.bat` file in the root directory.
2. OR run this command in your terminal:
   ```bash
   ./start_app.bat
   ```

### Standard Commands
If you prefer manual commands:
- **Start**: `docker-compose up -d`
- **Stop**: `docker-compose down`
- **Logs**: `docker-compose logs -f backend`

### StudyPulse: Your Daily Rhythm for Smarter Studying
StudyPulse is a comprehensive study management platform with progress tracking, gamification, and real-time collaboration.

## 🚀 Tech Stack
- **Frontend**: React.js, Redux Toolkit, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.io
- **Deployment**: Docker/Docker Compose

## 🛠️ Folder Structure
- `/backend`: Express server, business logic, and database schemas.
- `/frontend`: React components, state management, and UI.
- `/docker-compose.yml`: Local development orchestration.

## 🚦 Getting Started

### Prerequisites
- Node.js & npm
- Docker & Docker Compose
- MongoDB (if running without Docker)

### Installation
1. Clone the repository.
2. Setup environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.example` to `frontend/.env`
3. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Running with Docker
```bash
docker-compose up --build
```
This command builds the images and starts the containers:
- **Frontend**: Nginx serving the production build on port 80.
- **Backend**: Node.js API on port 5000.
- **Database**: MongoDB on port 27017.

### Running Locally
1. Backend: `cd backend && npm install && npm run dev`
2. Frontend: `cd frontend && npm install && npm run dev`

## 🏗️ Production Build Strategy
To deploy the application to a production environment:

1. **Backend**:
   - Set `NODE_ENV=production`.
   - Use a production-grade MongoDB (e.g., MongoDB Atlas).
   - Ensure `JWT_SECRET` is a long, random string.
   - Run via Docker: `docker build -t study-backend ./backend`.

2. **Frontend**:
   - Build the static assets: `cd frontend && npm run build`.
   - Serve the `/dist` folder using a high-performance web server like Nginx or cloud storage (S3/Vercel).
   - Run via Docker: `docker build -t study-frontend ./frontend`.

## 🛡️ Final Checklist
See [CHECKLIST.md](./CHECKLIST.md) for detailed security, performance, and scalability recommendations.
