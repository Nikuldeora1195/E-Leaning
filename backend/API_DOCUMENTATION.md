\# 🔌 EduVillage API Documentation

Base URL:

http://localhost:5000/api

All protected routes require:

Authorization: Bearer

\---

\# 🔐 Authentication Routes

\## Register User

POST \`/auth/register\`

\### Body:

\`\`\`json

{

"name": "John Doe",

"email": "john@example.com",

"password": "123456",

"role": "student"

}

Roles:

student

teacher

admin

Login User

POST /auth/login

Body:

{

"email": "john@example.com",

"password": "123456"

}

Response:

{

"token": "jwt\_token",

"user": {

"\_id": "...",

"name": "...",

"role": "student"

}

}

📚 Course Routes

Get All Published Courses

GET /courses

Create Course (Teacher)

POST /courses

Get Teacher Courses

GET /courses/my

Update Course

PUT /courses/:id

Publish Course

PUT /courses/:id/publish

Get Course By ID

GET /courses/:id

📂 Content Routes

Get Course Content

GET /content/:courseId

Create Section

POST /content/sections

Create Lesson

POST /content/lessons

Body:

{

"title": "Lesson 1",

"content": "Introduction",

"imageUrl": "optional",

"videoUrl": "optional",

"sectionId": "section\_id"

}

🎓 Enrollment Routes

Enroll in Course

POST /enroll/:courseId

Get My Courses (Student)

GET /enroll/my-courses

Update Progress

PUT /enroll/progress/:enrollmentId

Complete Lesson

PUT /enroll/lesson/:lessonId/complete

📝 Quiz Routes

Create Quiz (Teacher)

POST /quizzes

Body:

{

"courseId": "course\_id",

"title": "Quiz 1",

"questions": \[

{

"question": "What is React?",

"options": \["Library", "Framework", "Database", "API"\],

"correctAnswer": 0

}

\]

}

Get Quiz By Course

GET /quizzes/course/:courseId

Submit Quiz

POST /quizzes/submit

Body:

{

"quizId": "quiz\_id",

"answers": \[0, 2, 1\]

}

Response:

{

"score": 2,

"total": 3

}

👨‍🏫 Teacher Routes

Get Students of Course

GET /courses/:courseId/students

🛡️ Role-Based Access

RoleAccess

StudentEnroll, Learn, Quiz

TeacherCreate, Publish, Manage

AdminManage Users, Courses

📊 Status Codes

CodeMeaning

200Success

201Created

400Bad Request

401Unauthorized

403Forbidden

404Not Found

500Server Error

🧠 Security

JWT Authentication

Role-based middleware

Password hashing (bcrypt)

Protected routes

\---