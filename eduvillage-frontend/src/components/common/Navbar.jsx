import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = useMemo(() => {
    if (user?.role === "admin") {
      return [
        { to: "/admin/dashboard", label: "Dashboard" },
        { to: "/admin/users", label: "Users" },
        { to: "/admin/courses", label: "Courses" },
        { to: "/profile", label: "Profile" },
      ];
    }

    if (user?.role === "teacher") {
      return [
        { to: "/teacher/dashboard", label: "Dashboard" },
        { to: "/teacher/courses", label: "Courses" },
        { to: "/teacher/students", label: "Students" },
        { to: "/teacher/announcements/create", label: "Announcements" },
        { to: "/profile", label: "Profile" },
      ];
    }

    return [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/courses", label: "Courses" },
      { to: "/my-courses", label: "My Learning" },
      { to: "/announcements", label: "Announcements" },
      { to: "/profile", label: "Profile" },
    ];
  }, [user?.role]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;
  const homeRoute =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "teacher"
      ? "/teacher/dashboard"
      : "/dashboard";

  const closeMenu = () => setIsMobileMenuOpen(false);

  const renderSidebarContent = () => (
    <>
      <Link
        to={homeRoute}
        onClick={closeMenu}
        className="block rounded-[26px] border border-[#ece8f7] bg-white p-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#6d28d9] text-lg font-semibold text-white">
            L
          </div>
          <div>
            <p className="text-lg font-semibold text-[#1f1637]">LearnMax</p>
            <p className="text-sm text-[#7a7392]">
              {user?.role === "admin"
                ? "Admin Panel"
                : user?.role === "teacher"
                ? "Teacher Panel"
                : "Student Panel"}
            </p>
          </div>
        </div>
      </Link>

      <nav className="mt-6 space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={closeMenu}
            className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive(link.to)
                ? "bg-[#6d28d9] text-white"
                : "text-[#4f4864] hover:bg-[#f7f3ff] hover:text-[#1f1637]"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-[26px] border border-[#ece8f7] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f4f0ff] text-sm font-semibold text-[#6d28d9]">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-[#1f1637]">
              {user?.name || "User"}
            </p>
            <p className="truncate text-sm text-[#7a7392]">
              {user?.email || "No email"}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 w-full rounded-2xl border border-[#ecdffb] px-4 py-3 text-sm font-medium text-[#7c2d12] transition hover:bg-[#fff7ed]"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-40 border-b border-[#ece8f7] bg-white/95 backdrop-blur md:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to={homeRoute} className="text-lg font-semibold text-[#1f1637]">
            LearnMax
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-[#ece8f7] px-3 py-2 text-sm font-medium text-[#1f1637]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 border-r border-[#ece8f7] bg-[#fbfaff] p-6 md:block">
        <div className="sticky top-6">{renderSidebarContent()}</div>
      </aside>

      <div
        className={`fixed inset-0 z-50 md:hidden ${
          isMobileMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
          className={`absolute inset-0 bg-[#1f1637]/30 transition-opacity ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`relative z-10 h-full w-72 max-w-[85vw] bg-[#fbfaff] p-6 transition-transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent()}
        </aside>
      </div>
    </>
  );
};

export default Navbar;
