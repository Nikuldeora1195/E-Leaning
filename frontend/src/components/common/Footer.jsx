import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#ece8f7] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/learnmax.png"
                alt="LearnMax logo"
                className="h-10 w-10 rounded-2xl object-cover"
              />
              <div>
                <p className="text-lg font-semibold text-[#1f1637]">LearnMax</p>
                <p className="text-sm text-[#7a7392]">
                  E-learning platform by Nikul Kumar
                </p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#6b6680]">
              Learn, manage courses, and keep teaching and learning in one clean workspace.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[#1f1637]">
              Quick Links
            </h4>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[#6b6680]">
              <Link to="/courses" className="hover:text-[#6d28d9]">
                Browse Courses
              </Link>
              <Link to="/my-courses" className="hover:text-[#6d28d9]">
                My Learning
              </Link>
              <Link to="/announcements" className="hover:text-[#6d28d9]">
                Announcements
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-[#1f1637]">
              Support
            </h4>
            <div className="mt-4 flex flex-col gap-2 text-sm text-[#6b6680]">
              <Link to="/login" className="hover:text-[#6d28d9]">
                Login
              </Link>
              <Link to="/register" className="hover:text-[#6d28d9]">
                Register
              </Link>
              <p>Teacher access is managed by admin approval.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-[#f2eefb] pt-5 text-sm text-[#7a7392]">
          <p>&copy; {currentYear} LearnMax. E-learning platform by Nikul Kumar.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
