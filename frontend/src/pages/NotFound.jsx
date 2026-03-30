import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f7fb] px-4">
      <div className="w-full max-w-xl rounded-[32px] border border-[#ece8f7] bg-white p-10 text-center shadow-sm">
        <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
          404 Error
        </span>
        <h1 className="mt-6 text-4xl font-semibold text-[#1f1637]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-7 text-[#6b6680]">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/login"
            className="rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6]"
          >
            Go to Login
          </Link>
          <Link
            to="/dashboard"
            className="rounded-full border border-[#d9cff6] px-5 py-3 text-sm font-semibold text-[#6d28d9] transition hover:bg-[#f7f3ff]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
