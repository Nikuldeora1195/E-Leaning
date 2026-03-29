# 🔧 EduVillage Backend

This is the backend server for the **EduVillage Online Learning Platform**, a comprehensive REST API for managing digital education.

It is built using **Node.js**, **Express.js**, and **MongoDB**.

---
Live backend : https://fsd114-nikuldeora1195.onrender.com

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose ODM)
* **Authentication:** JWT (JSON Web Tokens)
* **Security:** Bcrypt (Password Hashing)
* **Environment Management:** Dotenv

---

## 📁 Folder Structure

```text
backend/
│
├── config/         # Database connection and environment config
├── controllers/    # Request handlers and business logic
├── middleware/     # Auth guards and role-based access
├── models/         # Mongoose schemas and data structures
├── routes/         # API endpoint definitions
├── server.js       # Main entry point
└── package.json    # Scripts and dependencies




⚙️ Setup Instructions
1️⃣ Install dependencies
Bash
npm install
2️⃣ Create .env file
Create a .env file in the backend root and configure your variables:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
3️⃣ Run Server
Bash
# Development mode
npm run dev

# Production mode
npm start
The server will run on: http://localhost:5000

🔐 Authentication System
JWT-based: Stateless authentication for secure client-server communication.

Encrypted: Passwords are salted and hashed using Bcrypt.

Protected Routes: Custom middleware ensures only authorized users can access specific data.

RBAC: Role-Based Access Control (Student vs. Teacher permissions).

📌 Available API Modules
👤 Auth
POST /api/auth/register — Register a new user

POST /api/auth/login — Authenticate and receive token

📚 Courses
GET /api/courses — Get all published courses

POST /api/courses — Create a course (Teacher)

PUT /api/courses/:id — Update course details

GET /api/courses/teacher — Get courses by specific teacher

📖 Course Content
POST /api/content/section — Add a new section to a course

POST /api/content/lesson — Add a lesson to a section

GET /api/content/:courseId — Fetch full syllabus structure

🎓 Enrollment & Progress
POST /api/enroll — Enroll in a course

GET /api/enroll/my-courses — View student's enrolled courses

PATCH /api/enroll/progress — Mark lessons as complete

📝 Quiz
POST /api/quiz — Create a quiz (Teacher)

GET /api/quiz/:courseId — Fetch quiz for a course

POST /api/quiz/submit — Submit quiz answers (Student)

🧱 Database Models
User: Profiles, credentials, and roles.

Course: Main course metadata (Title, Price, Instructor).

Section & Lesson: Hierarchical content structure.

Enrollment: Link between Students and Courses with progress tracking.

Quiz & QuizAttempt: Assessment data and student results.

🛡️ Middleware
protect: Verifies the JWT and attaches user data to the request.

authorizeRoles: Restricts access based on user type (e.g., 'teacher').

🧪 API Base URL
Plaintext
http://localhost:5000/api
Example Usage:

GET /api/courses

POST /api/auth/login

🧠 Backend Concepts Implemented
MVC Architecture: Clean separation of Models, Views (JSON), and Controllers.

RESTful Design: Standardized HTTP methods and status codes.

Schema Relationships: Linking data via MongoDB ObjectIDs and .populate().

Async/Await: Clean, readable asynchronous logic.

Error Handling: Robust try-catch blocks and centralized error responses.