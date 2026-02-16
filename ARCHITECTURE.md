# StudyPulse — System Architecture (Phase 1)

## 1. High-Level Architecture

The system follows a classic **MERN (MongoDB, Express, React, Node)** stack architecture with a real-time layer via **Socket.io**.

```mermaid
graph TD
    subgraph Client ["Frontend (React + Redux)"]
        A[React Components] --> B[Redux Store]
        A --> C[Socket.io Client]
        B --> D[API Client (Axios/RTK Query)]
    end

    subgraph Server ["Backend (Node.js + Express)"]
        D --> E[Express Router]
        E --> F[Auth Middleware (JWT)]
        F --> G[Controllers]
        G --> H[Services]
        H --> I[Mongoose Models]
        C <--> J[Socket.io Server]
        J --> H
    end

    subgraph Storage ["Database"]
        I <--> K[(MongoDB)]
    end

    subgraph Deployment ["Infrastructure (Docker)"]
        L[Frontend Container]
        M[Backend Container]
        N[Mongo Container]
        L -- Proxy --> M
        M --> N
    end
```

### Key Components:
- **Frontend**: Single Page Application using React 18+. Redux Toolkit manages UI state, authentication, and study session data. Socket.io handles live interactions in study rooms.
- **Backend**: RESTful API built with Express. Routes are protected by JWT middleware. Business logic is decoupled into `services/` for reusability (e.g., analytics calculations).
- **Real-time**: Custom socket handlers in `src/sockets` manage room entry/exit, message broadcasting, and participant lists.
- **Security**: 
    - **Authentication**: JWT-based (stored in HttpOnly cookies or Authorization header). 
    - **Authorization**: Role-based access (User/Admin).
    - **Safety**: Express Rate Limiter and input validation via `validator.js`.

---

## 2. Environment Variables Strategy

We use `.env` files for configuration. These are **never** committed to version control. `.env.example` serves as a template.

### Backend (`/backend/.env`)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: Local or Atlas connection string.
- `JWT_SECRET`: Secure string for signing tokens.
- `JWT_EXPIRES_IN`: e.g., `7d`.
- `CORS_ORIGIN`: URL of the frontend for security.

### Frontend (`/frontend/.env`)
- `VITE_API_URL`: Backend endpoint.
- `VITE_SOCKET_URL`: Socket.io server endpoint.

---

## 3. Deployment Configuration

Docker Compose orchestrates the three main services:
- **`db`**: MongoDB image.
- **`backend`**: Custom Node.js image (src/server.js).
- **`frontend`**: Custom React image (served via Nginx in production).
