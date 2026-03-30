📁 EduVillage Project Structure

EduVillage follows a clean MERN stack architecture with separate frontend and backend folders.

\---

\# 📦 Root Directory

EduVillage/

│

├── backend/

├── frontend/

├── README.md

├── PROJECT\_STRUCTURE.md

├── API\_DOCUMENTATION.md

\---

\# 🖥️ Backend Structure

backend/

│

├── controllers/

│ ├── auth.controller.js

│ ├── course.controller.js

│ ├── content.controller.js

│ ├── enrollment.controller.js

│ ├── quiz.controller.js

│

├── models/

│ ├── User.js

│ ├── Course.js

│ ├── Section.js

│ ├── Lesson.js

│ ├── Enrollment.js

│ ├── Quiz.js

│ ├── QuizAttempt.js

│

├── routes/

│ ├── auth.routes.js

│ ├── course.routes.js

│ ├── content.routes.js

│ ├── enrollment.routes.js

│ ├── quiz.routes.js

│

├── middleware/

│ ├── auth.middleware.js

│ ├── role.middleware.js

│

├── config/

│ ├── db.js

│

├── .env

├── server.js

└── package.json

\---

\# ⚙️ Backend Responsibilities

\- Authentication (JWT)

\- Role-based authorization

\- Course management

\- Section & lesson handling

\- Enrollment tracking

\- Quiz system

\- Student progress tracking

\- Certificate eligibility

\---

\# 🎨 Frontend Structure

frontend/

│

├── src/

│ ├── api/

│ │ ├── authApi.js

│ │ ├── courseApi.js

│ │ ├── contentApi.js

│ │ ├── teacherCourseApi.js

│ │

│ ├── components/

│ │ ├── common/

│ │ ├── app/

│ │ ├── student/

│ │ ├── teacher/

│ │

│ ├── context/

│ │ ├── AuthContext.jsx

│ │ ├── AuthProvider.jsx

│ │

│ ├── pages/

│ │ ├── auth/

│ │ ├── student/

│ │ ├── teacher/

│ │ ├── admin/

│ │

│ ├── utils/

│ │ ├── usePageTitle.js

│ │

│ ├── App.jsx

│ ├── main.jsx

│

├── public/

├── package.json

└── vite.config.js

\---

\# 🧠 Frontend Responsibilities

\- UI/UX rendering

\- Protected routes

\- Role-based navigation

\- Dashboard pages

\- Course browsing

\- Lesson viewing

\- Video playback

\- Quiz interface

\- Certificate generation

\- Student & teacher management

\---

\# 🔐 Authentication Flow

1\. User logs in

2\. JWT token stored in localStorage

3\. Axios interceptor attaches token

4\. Backend verifies token

5\. Role-based access applied

\---

\# 🔄 Data Flow Architecture

Frontend → Axios → Backend → MongoDB

MongoDB → Backend → JSON → Frontend UI

\---

\# 📌 Key Architectural Decisions

\- Context API for auth state

\- Modular API layer

\- Role-based protected routing

\- Component-based layout structure

\- Separate teacher/student dashboards

\- Clean RESTful API structure

\---

\# 📊 Scalability Ready

\- Easily extendable for:

\- Payments

\- Live classes

\- Real certificates

\- Video hosting services

\- Notifications

\- Admin analytics
