"use client";
import { useState } from "react";
import { FiMapPin, FiRefreshCw, FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle, FiShield } from "react-icons/fi";

export default function AddStationPage() {
  const [form, setForm] = useState({
    stationName: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Auto-generate username based on station name
  const generateUsername = () => {
    const stationName = form.stationName.toLowerCase().replace(/\s+/g, '_');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = stationName ? `${stationName}_${randomNum}` : `station_${randomNum}`;
    setForm({ ...form, username });
  };

  // Auto-generate strong password
  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    const allChars = uppercase + lowercase + numbers + special;
    
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    setForm({ ...form, password });
  };

  const handleReset = () => {
    setForm({
      stationName: "",
      username: "",
      password: "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/admin/create-station', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stationName: form.stationName,
          username: form.username,
          password: form.password,
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
      setError('Failed to create station. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-12 pb-24 md:pb-12">
      <div className="md:max-w-full md:mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-8 md:mb-12 bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl shadow-sm p-5 md:p-8 border border-purple-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-purple-500 to-pink-600 shadow-lg">
              <FiMapPin className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 tracking-tight mb-1">
                Add New Station
              </h1>
              <p className="text-slate-600 text-xs md:text-base flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
                Create a new station with auto-generated credentials
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
          {/* Form Card - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-lg rounded-2xl p-5 md:p-10 border border-slate-200"
            >
              {/* Form Header */}
              <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-100">
                <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-linear-to-br from-purple-500 to-pink-600 shadow-md">
                  <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-slate-800">Station Details</h2>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5">Fill in the station information below</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 md:space-y-8">
                {/* Station Name */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    Station Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="stationName"
                    value={form.stationName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Enter station name (e.g., City Police Station)"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                    required
                  />
                </div>

                {/* Username with Auto-Generate */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    Username <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      type="text"
                      placeholder="Click generate or enter manually"
                      className="flex-1 border border-slate-300 rounded-xl px-4 py-3.5 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateUsername}
                      className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-base"
                    >
                      <FiRefreshCw size={18} />
                      Generate
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Auto-generates username based on station name
                  </p>
                </div>

                {/* Password with Auto-Generate */}
                <div>
                  <label className="block text-sm md:text-base font-bold text-slate-700 mb-3">
                    Password <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <input
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="Click generate or enter manually"
                        className="w-full border border-slate-300 rounded-xl px-4 py-3.5 pr-12 text-base bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 active:text-slate-700 transition-colors p-1.5"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 active:scale-95 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl text-base"
                    >
                      <FiRefreshCw size={18} />
                      Generate
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 mt-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Auto-generates a strong 12-character password
                  </p>
                </div>

                {/* Password Requirements Info */}
                <div className="p-5 md:p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-bold text-slate-800 mb-3">Generated password includes:</p>
                      <ul className="text-xs md:text-sm text-slate-600 space-y-2">
                        <li className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          <span className="font-medium">Uppercase and lowercase letters</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          <span className="font-medium">Numbers and special characters</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                          <span className="font-medium">12 characters for maximum security</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Enhanced */}
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
                      Creating Station...
                    </>
                  ) : (
                    <>
                      <FiCheck size={20} />
                      Create Station
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="bg-slate-100 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-200 active:bg-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <FiRefreshCw size={20} />
                  Reset Form
                </button>
                <button
                  type="button"
                  disabled={loading}
                  className="bg-white border-2 border-slate-300 text-slate-700 font-bold px-8 md:px-10 py-4 md:py-3.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  <FiX size={20} />
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Right Sidebar - Tips & Information */}
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            {/* Security Best Practices */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <FiShield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">Security Best Practices</h3>
                  <p className="text-xs md:text-sm text-slate-600">Follow these guidelines for optimal security</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">1</span>
                  </div>
                  <span className="font-medium">Always use auto-generated passwords for maximum security</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">2</span>
                  </div>
                  <span className="font-medium">Share credentials securely with station administrators</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">3</span>
                  </div>
                  <span className="font-medium">Encourage password changes on first login</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-slate-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">4</span>
                  </div>
                  <span className="font-medium">Keep a secure backup of all station credentials</span>
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl shadow-md p-6 md:p-8 border-2 border-orange-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <FiAlertCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Important Notes</h3>
              </div>
              <ul className="space-y-2.5 text-xs md:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Station names must be unique across the system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Usernames are automatically formatted with underscores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Save credentials immediately after creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="font-medium">Stations can be edited after creation if needed</span>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-200">
              <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-5">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <span className="text-sm font-semibold text-slate-700">Total Stations</span>
                  <span className="text-2xl font-bold text-purple-600">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-sm font-semibold text-slate-700">Active Now</span>
                  <span className="text-2xl font-bold text-green-600">12</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-sm font-semibold text-slate-700">This Month</span>
                  <span className="text-2xl font-bold text-blue-600">+2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
