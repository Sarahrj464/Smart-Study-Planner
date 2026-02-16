# 🚀 How to Run - Smart Study Planner

Follow these steps to get your Smart Study Planner up and running. You can choose between the **Docker Method** (Recommended) or the **Manual Method**.

---

## 📋 Prerequisites
Before you start, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/products/docker-desktop/) & [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/try/download/community) (only for Manual Method)

---

## 🐳 Method 1: Docker (Fastest)
This method spins up the Backend, Frontend, and MongoDB database automatically in isolated containers.

### 1. Configure Environment
Create a `.env` file in the `backend/` directory:
```bash
# backend/.env
PORT=5000
MONGO_URI=mongodb://mongodb:27017/studyplanner
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 2. Launch the Application
Open your terminal in the root directory (where `docker-compose.yml` is) and run:
```bash
docker-compose up --build
```

### 3. Access the App
- **Frontend**: [http://localhost:80](http://localhost:80)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🛠️ Method 2: Manual (Development)
Use this method if you want to make changes and see them instantly with Hot Reloading.

### 1. Start MongoDB
Ensure your local MongoDB service is running. Default URI: `mongodb://localhost:27017/studyplanner`.

### 2. Setup Backend
```bash
cd backend
npm install
```
Create `backend/.env`:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/studyplanner
JWT_SECRET=local_dev_secret
NODE_ENV=development
```
Start Backend:
```bash
npm run dev
```

### 3. Setup Frontend
Open a **new** terminal:
```bash
cd frontend
npm install
```
Start Frontend:
```bash
npm run dev
```

### 4. Access the App
- **Frontend**: [http://localhost:5173](http://localhost:5173) (or the port shown in terminal)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## ✅ Post-Launch Steps
1. **Signup**: Create a new account.
2. **Features**:
   - Go to **Pomodoro** and finish a session to gain XP.
   - Go to **Timetable** to build your weekly schedule.
   - Join a **Study Room** to test the real-time chat (open in two browser tabs to chat with yourself!).
3. **Admin**: If you need to test Admin features, change your user role to `admin` directly in the database.

---

## 🛑 Troubleshooting
- **Docker Errors**: Ensure Docker Desktop is running. Try `docker-compose down -v` to clear volumes if you have data conflicts.
- **Port Conflicts**: If port 80 or 5000 is taken, update the `ports` mapping in `docker-compose.yml`.
- **API Connection**: If the frontend can't find the backend, check that the `VITE_API_URL` in frontend matches the backend address.
