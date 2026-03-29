// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/auth/Login";
// import Register from "./pages/auth/Register";
// import AddSection from "./pages/course/AddSection";
// import StudentDashboard from "./pages/dashboard/StudentDashboard";
// import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
// import Announcements from "./pages/student/Announcements";
// import CreateAnnouncement from "./pages/teacher/CreateAnnouncement";
// import CreateCourse from "./pages/teacher/CreateCourse";
// import EditCourse from "./pages/teacher/EditCourse";

// import CourseList from "./pages/student/CourseList";
// import MyCourses from "./pages/student/MyCourses";
// import TeacherCourses from "./pages/teacher/MyCourses";
// import NotFound from "./pages/NotFound";

// import CourseDetail from "./pages/student/CourseDetail";
// import CourseContent from "./pages/course/CourseContent";
// import ProtectedRoute from "./components/protected/ProtectedRoute";

// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminCourses from "./pages/admin/AdminCourses";

// import Students from "./pages/teacher/Students";

// import Certificate from "./pages/student/Certificate";


// import CreateQuiz from "./pages/teacher/CreateQuiz";
// import QuizPage from "./pages/student/QuizPage";

// import Footer from "./components/common/Footer";
// function App() {
//   return (

    
//     <BrowserRouter>
    
//       <Routes>
//         {/* ================= AUTH ROUTES (NO NAVBAR) ================= */}
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* ================= APP ROUTES (WITH NAVBAR) ================= */}
//         <Route
//           path="/*"
//           element={
//             <>
//               <Routes>
//                 {/* Student routes */}
//                 <Route
//                   path="/dashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <StudentDashboard />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <CourseList />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/my-courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["student"]}>
//                       <MyCourses />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/announcements"
//                   element={
//                     <ProtectedRoute allowedRoles={["student", "teacher"]}>
//                       <Announcements />
//                     </ProtectedRoute>
//                   }
//                 />

//                 {/* Teacher routes */}
//                 <Route
//                   path="/teacher/dashboard"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <TeacherDashboard />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/teacher/courses"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <TeacherCourses />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/teacher/announcements/create"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher", "admin"]}>
//                       <CreateAnnouncement />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/courses/:id"
//                   element={
//                     <ProtectedRoute allowedRoles={["student", "teacher"]}>
//                       <CourseDetail />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/teacher/courses/create"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <CreateCourse />
//                     </ProtectedRoute>
//                   }
//                 />

//                 <Route
//                   path="/teacher/courses/:id/edit"
//                   element={
//                     <ProtectedRoute allowedRoles={["teacher"]}>
//                       <EditCourse />
//                     </ProtectedRoute>
//                   }
//                 />

              

//        <Route
//   path="/courses/:courseId/content"
//   element={
//     <ProtectedRoute allowedRoles={["teacher", "student"]}>
//       <CourseContent />
//     </ProtectedRoute>
//   }
// />


// <Route
//   path="/courses/:courseId/add-section"
//   element={
//     <ProtectedRoute allowedRoles={["teacher"]}>
//       <AddSection />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/admin/dashboard"
//   element={
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <AdminDashboard />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/admin/users"
//   element={
//     <ProtectedRoute allowedRoles={["admin"]}>
//       <AdminUsers />
//     </ProtectedRoute>
//   }
// />


// <Route 
// path="/admin/courses" 
// element={
// <ProtectedRoute allowedRoles={["admin"]}>
//   <AdminCourses />
//   </ProtectedRoute>
// } />


// // In your Routes
// <Route path="/teacher/students" element={
//   <ProtectedRoute allowedRoles={["teacher"]}>
//   <Students />
//   </ProtectedRoute>} />



// // Teacher route
// <Route
//   path="/teacher/course/:courseId/quiz/create"
//   element={
//     <ProtectedRoute allowedRoles={["teacher"]}>
//       <CreateQuiz />
//     </ProtectedRoute>
//   }
// />

// // Student route
// <Route
//   path="/courses/:courseId/quiz"
//   element={
//     <ProtectedRoute allowedRoles={["student"]}>
//       <QuizPage />
//     </ProtectedRoute>
//   }
// />



// <Route path="/certificate/:courseTitle" element={<Certificate />} />


//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard & Management
import StudentDashboard from "./pages/dashboard/StudentDashboard";
import TeacherDashboard from "./pages/dashboard/TeacherDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// Course Pages
import CourseList from "./pages/student/CourseList";
import MyCourses from "./pages/student/MyCourses";
import TeacherCourses from "./pages/teacher/MyCourses";
import CourseDetail from "./pages/student/CourseDetail";
import CourseContent from "./pages/course/CourseContent";
import AddSection from "./pages/course/AddSection";
import CreateCourse from "./pages/teacher/CreateCourse";
import EditCourse from "./pages/teacher/EditCourse";

// Admin & Teacher Tools
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminCourses from "./pages/admin/AdminCourses";
import Students from "./pages/teacher/Students";
import CreateAnnouncement from "./pages/teacher/CreateAnnouncement";
import Announcements from "./pages/student/Announcements";
import CreateQuiz from "./pages/teacher/CreateQuiz";

// Student Tools
import QuizPage from "./pages/student/QuizPage";
import Certificate from "./pages/student/Certificate";

// Common
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import Footer from "./components/common/Footer";

function App() {
  return (
    <BrowserRouter>
      {/* 1. Main wrapper ensures the footer stays at the bottom */}
      <div className="min-h-screen flex flex-col">
        
        {/* 2. flex-1 allows this container to grow and push the footer down */}
        <div className="flex-1">
          <Routes>
            {/* ================= AUTH ROUTES ================= */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ================= PROTECTED STUDENT ROUTES ================= */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={["student"]}> <StudentDashboard /> </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={["student"]}> <CourseList /> </ProtectedRoute>
            } />
            <Route path="/my-courses" element={
              <ProtectedRoute allowedRoles={["student"]}> <MyCourses /> </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/quiz" element={
              <ProtectedRoute allowedRoles={["student"]}> <QuizPage /> </ProtectedRoute>
            } />
            <Route path="/certificate/:courseTitle" element={<Certificate />} />

            {/* ================= PROTECTED TEACHER ROUTES ================= */}
            <Route path="/teacher/dashboard" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <TeacherDashboard /> </ProtectedRoute>
            } />
            <Route path="/teacher/courses" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <TeacherCourses /> </ProtectedRoute>
            } />
            <Route path="/teacher/courses/create" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <CreateCourse /> </ProtectedRoute>
            } />
            <Route path="/teacher/courses/:id/edit" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <EditCourse /> </ProtectedRoute>
            } />
            <Route path="/teacher/students" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <Students /> </ProtectedRoute>
            } />
            <Route path="/teacher/course/:courseId/quiz/create" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <CreateQuiz /> </ProtectedRoute>
            } />
            <Route path="/teacher/announcements/create" element={
              <ProtectedRoute allowedRoles={["teacher", "admin"]}> <CreateAnnouncement /> </ProtectedRoute>
            } />

            {/* ================= SHARED ROUTES ================= */}
            <Route path="/announcements" element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}> <Announcements /> </ProtectedRoute>
            } />
            <Route path="/courses/:id" element={
              <ProtectedRoute allowedRoles={["student", "teacher"]}> <CourseDetail /> </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/content" element={
              <ProtectedRoute allowedRoles={["teacher", "student"]}> <CourseContent /> </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/add-section" element={
              <ProtectedRoute allowedRoles={["teacher"]}> <AddSection /> </ProtectedRoute>
            } />

            {/* ================= ADMIN ROUTES =================
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={["admin"]}> <AdminDashboard /> </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={["admin"]}> <AdminUsers /> </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute allowedRoles={["admin"]}> <AdminCourses /> </ProtectedRoute>
            } /> */}

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* 3. Footer will always stay at the bottom of the viewport or below content */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;