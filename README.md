# LearnMax

LearnMax is a full-stack MERN e-learning platform built by **Nikul Kumar**.

It is designed as a personal internship-ready LMS project with separate flows for students, teachers, and admins. The app supports course creation, content management, enrollments, quizzes, certificates, reviews, analytics, and role-based dashboards.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT, bcrypt
- File Uploads: Multer

## Current Features

### Student
- Register and login
- Browse published courses
- Enroll in courses
- Learn through sections and lessons
- Upload-backed lesson media playback
- Automatic progress tracking from lesson completion
- Take quizzes and view attempt history
- View certificates
- Leave course reviews after completion
- Update profile settings

### Teacher
- Create and edit courses
- Add, edit, and delete sections and lessons
- Upload lesson images and videos
- Publish or unpublish courses
- Create multi-question quizzes with passing score
- View enrolled students
- View teaching analytics and top course performance
- Update profile settings

### Admin
- View dashboard stats
- Manage users
- Approve or reject teacher access requests
- Change user roles
- Enable or disable users
- Manage courses

## Project Structure

```text
E-Leaning/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    uploads/
  eduvillage-frontend/
    public/
    src/
      api/
      components/
      context/
      pages/
```

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd E-Leaning
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env` from `backend/.env.example` and set:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start backend:

```bash
npm start
```

### 3. Frontend setup

```bash
cd ../eduvillage-frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Important Notes

- Public registration creates a student account by default.
- Users can request teacher access during registration.
- Admin approves teacher access from the admin users page.
- Progress is now calculated automatically from completed lessons.
- Uploaded lesson files are stored locally in `backend/uploads`.
- Some features depend on valid local MongoDB data, so fresh databases will start empty.

## Main Routes

### Frontend

- `/login`
- `/register`
- `/dashboard`
- `/courses`
- `/my-courses`
- `/courses/:id`
- `/courses/:courseId/content`
- `/courses/:courseId/quiz`
- `/teacher/dashboard`
- `/teacher/courses`
- `/admin/dashboard`
- `/admin/users`
- `/admin/courses`
- `/profile`

### Backend API

- `/api/auth`
- `/api/users`
- `/api/courses`
- `/api/content`
- `/api/enroll`
- `/api/quizzes`
- `/api/reviews`
- `/api/admin`
- `/api/certificates`

## Deployment Checklist

- Set production `MONGO_URI`
- Set production `JWT_SECRET`
- Configure backend CORS for deployed frontend URL
- Add production frontend API base URL if needed
- Make sure `uploads/` handling is suitable for deployment
- Test student, teacher, and admin flows once after deployment

## Final Note

This repository is maintained as **LearnMax**, an e-learning platform by **Nikul Kumar**, and is intended as a clean full-stack personal project for internships and portfolio presentation.
