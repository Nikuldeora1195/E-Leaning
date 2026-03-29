import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  // ⏳ Wait for auth state to load
  if (loading) return null;

  // 🔐 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to correct dashboard instead of login
    if (user.role === "teacher") {
      return <Navigate to="/teacher/dashboard" replace />;
    }

    if (user.role === "student") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
