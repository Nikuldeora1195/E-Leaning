import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/admin/users", icon: "👥", label: "Users" },
    { path: "/admin/courses", icon: "📚", label: "Courses" },
    // { path: "/admin/reports", icon: "📈", label: "Reports" },
    // { path: "/admin/settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <aside className="w-64 bg-white min-h-screen p-6 sticky top-0 shadow-lg border-r border-[#CCE7EC]">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <div className="bg-linear-to-br from-[#1B9AAA] to-[#16808D] p-2 rounded-lg">
            <span className="text-xl font-bold text-white">📚</span>
          </div>
          <div>
            <span className="text-xl font-bold text-[#142C52] block">EduVillage</span>
            <span className="text-xs text-[#071426] opacity-60">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Navigation */}

      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-linear-to-r from-[#1B9AAA] to-[#16808D] text-white shadow-md"
                : "text-[#071426] hover:bg-[#CCE7EC]"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#071426] hover:bg-red-50 hover:text-[#EF4444] transition-colors"
        >
          <span className="text-xl">🚪</span>
          <span className="font-medium">Logout</span>
        </button>
      </nav>

      {/* Admin Badge */}
      <div className="mt-8 bg-linear-to-br from-[#1B9AAA] to-[#16808D] rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-xl">👨‍💼</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Admin Access</p>
            <p className="text-white/80 text-xs">Full Control</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;