import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const authMessage = sessionStorage.getItem("authMessage");

    if (authMessage) {
      toast.error(authMessage);
      sessionStorage.removeItem("authMessage");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      const res = await loginUser(form);
      const { token, user } = res.data;

      login(user, token);
      toast.success(`Welcome back, ${user.name || "User"}!`, { id: toastId });

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(
        error.response?.data?.message || "Invalid email or password",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fb] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[#ece8f7] bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[#faf8ff] p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6d28d9] text-lg font-semibold text-white">
                L
              </div>
              <div>
                <p className="text-xl font-semibold text-[#1f1637]">LearnMax</p>
                <p className="text-sm text-[#7a7392]">
                  E-learning platform by Nikul Kumar
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-md space-y-5">
              <span className="inline-flex rounded-full bg-white px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Student, Teacher, and Admin Access
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-[#1f1637]">
                Learn in a simple way with a clean and focused workspace.
              </h1>
              <p className="text-base leading-7 text-[#6b6680]">
                Continue your courses, manage your content, and keep everything
                in one place with LearnMax.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-sm font-medium text-[#7a7392]">For Students</p>
              <p className="mt-2 text-sm leading-6 text-[#5e5872]">
                Track progress, continue lessons, and stay updated.
              </p>
            </div>
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-sm font-medium text-[#7a7392]">For Educators</p>
              <p className="mt-2 text-sm leading-6 text-[#5e5872]">
                Create courses, manage lessons, and publish content.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3 text-center lg:text-left">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Welcome Back
              </span>
              <h2 className="text-3xl font-semibold text-[#1f1637]">
                Sign in to your account
              </h2>
              <p className="text-sm text-[#6b6680]">
                Enter your details to continue learning.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4864]">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-[#4f4864]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#6d28d9] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 pr-20 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium text-[#6d28d9] hover:bg-[#f7f3ff]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6b6680]">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-[#6d28d9]">
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
