

# React Authentication Chat Applicatio

**Important Note:**
To experience the full-stack deployment correctly, you must first open the backend Render link and wait until it fully loads (Render free-tier services may take around 30–60 seconds due to cold start).
Once the backend is live, open the frontend link.
Otherwise, you may get stuck on the Sign In / Sign Up page while filling details.

deployment link:https://chat-app-frontend-okpp.onrender.com

---

## Project Overview

This is a full-stack authentication-based chat application built with modern JavaScript technologies. It features user authentication, a real-time chat interface, a credits-based messaging system, and a secure cloud-based deployment.

---

## Frontend Tech Stack

* React 18 – Component-based UI library
* Redux Toolkit – Predictable and centralized state management
* React Router Dom v6 – Client-side routing with protected routes
* Axios – API communication with interceptors and token handling
* CSS3 (Flexbox, Grid, Animations, Responsive Design)

---

## Backend Tech Stack

* Node.js – Server runtime
* Express.js – REST API framework
* MongoDB Atlas + Mongoose – NoSQL database with schema validation
* JWT (JSON Web Tokens) – Stateless authentication
* bcryptjs – Password hashing and verification
* CORS – Secure cross-origin requests

---

## Authentication & Security

* Secure login/signup with JWT
* Passwords hashed with bcrypt
* Token-based route protection
* CORS configured for production domains

---

## Features

* Authentication: Sign up, login, protected routes
* Chat Interface: Send and receive messages in real-time
* Credits System: Credits decrease per message sent, prevents sending when 0
* Notifications: Real-time notifications with unread badge
* Responsive Design: Works on desktop and mobile
* Error Handling: User-friendly error messages, retry logic, loading states

---

## Deployment

* Frontend: Hosted on Render/Vercel (static deployment)
* Backend: Hosted on Render (web service deployment)
* Database: MongoDB Atlas (cloud database)

---

## Installation (Local Setup)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
```

Start backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm start
```

Frontend runs on `http://localhost:3000`
Backend runs on `http://localhost:5000`

---

## State Management Example (Redux)

```javascript
auth: {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null
},
chat: {
  messages: [],
  activeChat: null,
  chats: []
},
notifications: {
  items: [],
  unreadCount: 0
}
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.

---

## License

This project is licensed under the MIT License.

---

Do you want me to also **add placeholders for your Render/Vercel live links** in the README under a "Live Demo" section?
