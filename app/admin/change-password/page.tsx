"use client";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiCheck, FiX, FiShield, FiAlertTriangle } from "react-icons/fi";

export default function ChangePasswordPage() {
  const [form, setForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate new password in real-time
    if (name === "new") {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecial: /[@$!%*?&#]/.test(value),
      });
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (form.new !== form.confirm) {
      setError("New password and confirm password do not match");
      setLoading(false);
      return;
    }

    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError("Password does not meet the requirements");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: form.current,
          newPassword: form.new,
          confirmPassword: form.confirm,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(data.message);
        handleReset();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ current: "", new: "", confirm: "" });
    setPasswordValidation({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecial: false,
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiLock className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Change Password
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Update your password to keep your account secure
              </p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-green-50 border-l-4 border-green-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm md:text-base text-green-700 font-semibold">{success}</p>
            </div>
            <button
              onClick={() => setSuccess("")}
              className="text-green-700 hover:text-green-900 p-1.5 hover:bg-green-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 bg-red-50 border-l-4 border-red-500 rounded-xl shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <FiX className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-sm md:text-base text-red-700 font-semibold">{error}</p>
            </div>
            <button
              onClick={() => setError("")}
              className="text-red-700 hover:text-red-900 p-1.5 hover:bg-red-100 rounded-lg transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Password Form Card - Takes 2 columns */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-lg rounded-2xl p-5 md:p-10 border border-slate-200"
            >
              {/* Security Icon Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 shadow-md">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-800">Security Settings</h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Enter your current and new password</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-8">
                {/* Current Password */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    Current Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      name="current"
                      value={form.current}
                      onChange={handleChange}
                      placeholder="Enter your current password"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-12 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5"
                    >
                      {showPassword.current ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    New Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      name="new"
                      value={form.new}
                      onChange={handleChange}
                      placeholder="Enter your new password"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-12 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5"
                    >
                      {showPassword.new ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    Confirm New Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder="Re-enter your new password"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-12 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1.5"
                    >
                      {showPassword.confirm ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements with Real-time Validation */}
                <div className="p-5 md:p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <FiShield className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-sm md:text-base font-bold text-slate-800">Password Requirements:</p>
                  </div>
                  <ul className="text-xs md:text-sm text-slate-600 space-y-2.5">
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordValidation.minLength ? 'bg-green-500' : 'bg-slate-300'
                      }`}>
                        {passwordValidation.minLength ? (
                          <FiCheck className="text-white" size={14} strokeWidth={3} />
                        ) : (
                          <FiX className="text-white" size={14} strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-medium ${passwordValidation.minLength ? "text-green-700" : ""}`}>
                        At least 8 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordValidation.hasUpperCase ? 'bg-green-500' : 'bg-slate-300'
                      }`}>
                        {passwordValidation.hasUpperCase ? (
                          <FiCheck className="text-white" size={14} strokeWidth={3} />
                        ) : (
                          <FiX className="text-white" size={14} strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-medium ${passwordValidation.hasUpperCase ? "text-green-700" : ""}`}>
                        One uppercase letter (A-Z)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordValidation.hasLowerCase ? 'bg-green-500' : 'bg-slate-300'
                      }`}>
                        {passwordValidation.hasLowerCase ? (
                          <FiCheck className="text-white" size={14} strokeWidth={3} />
                        ) : (
                          <FiX className="text-white" size={14} strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-medium ${passwordValidation.hasLowerCase ? "text-green-700" : ""}`}>
                        One lowercase letter (a-z)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordValidation.hasNumber ? 'bg-green-500' : 'bg-slate-300'
                      }`}>
                        {passwordValidation.hasNumber ? (
                          <FiCheck className="text-white" size={14} strokeWidth={3} />
                        ) : (
                          <FiX className="text-white" size={14} strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-medium ${passwordValidation.hasNumber ? "text-green-700" : ""}`}>
                        One number (0-9)
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        passwordValidation.hasSpecial ? 'bg-green-500' : 'bg-slate-300'
                      }`}>
                        {passwordValidation.hasSpecial ? (
                          <FiCheck className="text-white" size={14} strokeWidth={3} />
                        ) : (
                          <FiX className="text-white" size={14} strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-medium ${passwordValidation.hasSpecial ? "text-green-700" : ""}`}>
                        One special character (@$!%*?&#)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-12 pt-8 border-t-2 border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-98 shadow-lg hover:shadow-xl'
                  } text-white font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl transition-all text-sm md:text-base flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Update Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleReset}
                  className="bg-slate-100 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <FiX size={20} />
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Security Tips */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            {/* Security Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <FiShield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Security Tips</h3>
                  <p className="text-xs md:text-sm text-slate-600">Keep your account safe</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <span className="font-medium">Use a unique password you don&apos;t use elsewhere</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <span className="font-medium">Change your password regularly (every 90 days)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <span className="font-medium">Never share your password with anyone</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">4</span>
                  </div>
                  <span className="font-medium">Use a password manager for added security</span>
                </li>
              </ul>
            </div>

            {/* Important Notice */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl shadow-md p-6 md:p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <FiAlertTriangle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Important Notice</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">You will be logged out after changing your password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Make sure to remember your new password</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Contact support if you face any issues</span>
                </li>
              </ul>
            </div>

            {/* Last Changed Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-4">Password History</h3>
              <div className="space-y-3">
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-xs text-slate-500 mb-1">Last Changed</p>
                  <p className="text-sm font-bold text-slate-800">30 days ago</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <p className="text-xs text-slate-500 mb-1">Password Strength</p>
                  <p className="text-sm font-bold text-green-700">Strong</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-slate-500 mb-1">Recommended Change</p>
                  <p className="text-sm font-bold text-blue-700">In 60 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
