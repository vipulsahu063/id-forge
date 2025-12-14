"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiLock, FiEye, FiEyeOff, FiMapPin, FiArrowRight, FiShield } from "react-icons/fi";

export default function StationLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const station_id = formData.get("station_id") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("station-login", {
        station_id,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid station ID or password");
      } else {
        router.push("/station/add-officer");
        router.refresh();
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Branding & Info (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg border border-white/50">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <FiMapPin className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Police Station</h2>
                <p className="text-sm text-slate-600">Officer Management Portal</p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                Station Access
                <br />
                <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-md">
                Secure login for police station personnel to manage officer records and operations.
              </p>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Officer Management</p>
                <p className="text-xs text-slate-600">Add and manage officers</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Record Keeping</p>
                <p className="text-xs text-slate-600">Digital documentation system</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-white/50 shadow-sm">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Secure Platform</p>
                <p className="text-xs text-slate-600">Protected and encrypted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 p-6 md:p-10 w-full max-w-md">
            {/* Mobile Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 shadow-xl mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                Station Login
              </h1>
              <p className="text-slate-500 text-sm md:text-base">Access your station portal</p>
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
              {/* Station ID Field */}
              <div>
                <label htmlFor="station_id" className="block text-sm font-bold text-slate-700 mb-3">
                  Station ID
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiMapPin size={20} />
                  </div>
                  <input
                    id="station_id"
                    name="station_id"
                    type="text"
                    required
                    placeholder="PS001"
                    className="w-full pl-12 pr-4 py-3.5 md:py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md uppercase"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-3">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <FiLock size={20} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-14 py-3.5 md:py-4 bg-white border-2 border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors p-1"
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
                    : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 active:scale-98 shadow-lg hover:shadow-xl'
                } text-white font-bold py-3.5 md:py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login to Station Portal</span>
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

            {/* Admin Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">
                System administrator? Access admin panel
              </p>
              <a 
                href="/admin-login" 
                className="inline-flex items-center justify-center gap-2 w-full bg-white border-2 border-blue-200 text-blue-700 font-bold py-3.5 md:py-4 rounded-xl hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-all shadow-sm hover:shadow-md"
              >
                <FiShield className="w-5 h-5" />
                Admin Login
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
