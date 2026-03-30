import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import usePageTitle from "../../utils/usePageTitle";
import toast from "react-hot-toast";

const Register = () => {
  usePageTitle("Register | LearnMax");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ ...form, role: "student" });
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to create account. Please check if the backend is running.";
      toast.error(message);
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fb] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[32px] border border-[#ece8f7] bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-3 text-center lg:text-left">
              <span className="inline-flex rounded-full bg-[#f4f0ff] px-4 py-1 text-sm font-medium text-[#6d28d9]">
                Create Account
              </span>
              <h1 className="text-3xl font-semibold text-[#1f1637]">
                Start your learning journey
              </h1>
              <p className="text-sm text-[#6b6680]">
                Create your student account. Teacher access is managed by admin.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4864]">
                  Full Name
                </label>
                <input
                  className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#4f4864]">
                  Email
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
                <label className="mb-2 block text-sm font-medium text-[#4f4864]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-2xl border border-[#ddd6f3] px-4 py-3 pr-20 text-sm text-[#1f1637] outline-none transition focus:border-[#6d28d9]"
                    placeholder="Create a password"
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

              <div className="rounded-[20px] border border-[#ece8f7] bg-[#faf8ff] px-4 py-3 text-sm text-[#5e5872]">
                New accounts are created as{" "}
                <span className="font-semibold text-[#1f1637]">students</span>.
                Teacher access is assigned later from the admin panel.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5b21b6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6b6680]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#6d28d9]">
                Login
              </Link>
            </p>
          </div>
        </section>

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
                Simple and Modern
              </span>
              <h2 className="text-4xl font-semibold leading-tight text-[#1f1637]">
                Learn with a simpler, cleaner platform that feels more personal.
              </h2>
              <p className="text-base leading-7 text-[#6b6680]">
                LearnMax keeps the same working flows while focusing on a clean
                and beginner-friendly learning experience.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-sm font-medium text-[#7a7392]">Student Mode</p>
              <p className="mt-2 text-sm leading-6 text-[#5e5872]">
                Enroll in courses, track progress, and view certificates.
              </p>
            </div>
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-sm font-medium text-[#7a7392]">Teacher Access</p>
              <p className="mt-2 text-sm leading-6 text-[#5e5872]">
                Teacher access is enabled by admin after account approval.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
