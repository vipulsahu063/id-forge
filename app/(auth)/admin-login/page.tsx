"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("admin-login", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Branding & Info (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
                <FiShield className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Admin Portal</h2>
                <p className="text-sm text-slate-600">Secure Access System</p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                Welcome Back,
                <br />
                <span className="bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Administrator
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md">
                Sign in to access your admin dashboard and manage all station operations securely.
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Secure Authentication</p>
                <p className="text-xs text-slate-600">End-to-end encrypted login</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Role-Based Access</p>
                <p className="text-xs text-slate-600">Admin-level permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Data Protection</p>
                <p className="text-xs text-slate-600">Advanced security measures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 p-6 md:p-10 w-full max-w-md">
            {/* Mobile Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-xl mb-4 md:mb-6">
                <FiShield className="text-white text-2xl md:text-3xl" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Admin Login
              </h1>
              <p className="text-slate-500 text-sm md:text-base">Access your admin dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-red-700 font-semibold">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-3">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <FiMail size={20} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="admin@example.com"
                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
                    <FiLock size={20} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-14 py-3.5 md:py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-98 shadow-lg hover:shadow-xl'
                } text-white font-bold py-3.5 md:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login as Admin</span>
                    <FiArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 border-t-2 border-slate-200"></div>
              <span className="px-4 text-slate-400 text-sm font-semibold">OR</span>
              <div className="flex-1 border-t-2 border-slate-200"></div>
            </div>

            {/* Station Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                Not an admin? Access station portal
              </p>
              <a 
                href="/station/login" 
                className="inline-flex items-center justify-center gap-2 w-full bg-white border-2 border-purple-200 text-purple-700 font-bold py-3.5 md:py-4 rounded-xl hover:bg-purple-50 hover:border-purple-300 active:bg-purple-100 transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Station Login
              </a>
            </div>

            {/* Footer Note */}
            <div className="mt-8 pt-6 border-t-2 border-slate-100">
              <p className="text-center text-xs text-slate-500">
                🔒 Your connection is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add blob animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
