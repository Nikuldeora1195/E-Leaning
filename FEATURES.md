# 🚀 EduVillage Features Documentation


EduVillage is a full-stack MERN-based Online Learning Platform built with modern UI and role-based architecture.


---


# 👤 User Roles


EduVillage supports three types of users:


- 🧑‍🎓 Student
- 👨‍🏫 Teacher
- 👑 Admin


Each role has specific access permissions.


---


# 🔐 Authentication & Authorization


- JWT-based authentication
- Secure password hashing (bcrypt)
- Role-based protected routes
- Persistent login using localStorage
- Automatic token attachment via Axios interceptor


---


# 🎓 Student Features


### 📚 Course Access
- Browse published courses
- Enroll in courses
- View course content


### 📖 Lesson System
- Structured sections and lessons
- Image support
- Video support (YouTube & MP4)
- Mark lesson as complete
- Progress tracking


### 🎥 Video Learning
- YouTube embed support
- MP4 playback
- In-course video viewing


### 📝 Quiz System
- Attempt quizzes
- Auto score calculation
- Quiz result display
- Score stored in database


### 📊 Progress Tracking
- Section-wise progress
- Overall course progress
- Completion percentage


### 🏆 Certificate Generation (Simulated)
- Auto available after completion
- Real student name displayed
- Course title included
- Print / Save as PDF option
- Custom logo support


---


# 👨‍🏫 Teacher Features


### 📚 Course Management
- Create courses
- Edit courses
- Publish / Unpublish courses
- View own courses


### 📂 Section Management
- Add sections
- Organize lessons


### 📖 Lesson Creation
- Add title
- Add content
- Add image URL
- Add video URL


### 📝 Quiz Management
- Create quizzes
- Add questions
- Add options
- Set correct answers
- View results


### 👥 Student Monitoring
- View enrolled students
- Track progress
- See completion statistics


---


# 👑 Admin Features


- Access admin dashboard
- Manage users
- Monitor platform usage


---


# 📊 Dashboard Analytics


Teacher dashboard includes:
- Total courses
- Published courses
- Draft courses
- Total students
- Recent courses


Student dashboard includes:
- Enrolled courses
- Progress summary
- Certificate eligibility


---


# 🔎 Search Functionality


- Course search
- Student search
- Real-time filtering


---


# 🎨 UI/UX Features


- Tailwind CSS modern UI
- Gradient dashboard design
- Responsive layout
- Sidebar navigation
- Animated transitions
- Clean card-based design


---


# 🔁 REST API Structure


- RESTful endpoints
- Protected routes
- Role-based middleware
- Clean controller separation


---


# 🛠 Technical Highlights


- MERN Stack Architecture
- MongoDB relational referencing
- Context API state management
- Axios interceptors
- JWT authentication
- Dynamic routing
- Protected layout components


---


# 🌟 Advanced Features Implemented


- Video playback inside lessons
- Quiz scoring system
- Certificate generation
- Student progress tracking
- Real student statistics
- Role-based dashboards
- Modular API structure


---


# 📈 Future Scope
- Real payment integration
- Live video classes
- Cloud video hosting
- Real certificate PDF generation
- Email notifications
- Chat / Q&A forum
- AI-based recommendations


