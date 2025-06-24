# Chat App

A full-stack, production-ready, real-time chat application with authentication, group and direct messaging, file/image uploads, and a modern UI.

## Features
- User authentication (JWT)
- Real-time messaging (Socket.io)
- Group and direct chats
- File and image uploads
- User search and chat creation
- Responsive, modern UI

## Tech Stack
- Backend: Node.js, Express, MongoDB, Socket.io
- Frontend: React, Redux Toolkit, TypeScript
- Dockerized for easy deployment

## Local Development

### Prerequisites
- Node.js 18+
- npm
- MongoDB (local or Atlas)

### Backend
```bash
cd backend
npm install
cp .env.example .env # Edit with your values
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_super_secret
PORT=5000
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Docker Deployment

1. Build and run all services:
   ```bash
   docker-compose up --build
   ```
2. Access the app at [http://localhost](http://localhost)

## File Uploads
- Uploaded files are stored in `backend/uploads` (mounted in Docker).

## Customization
- Update environment variables as needed for production.
- For HTTPS, use a reverse proxy (Nginx, Caddy, etc.).

---

**Enjoy your new chat app!** 
