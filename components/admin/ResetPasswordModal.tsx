"use client";
import { useState } from "react";
import { FiX, FiEye, FiEyeOff, FiRefreshCw, FiCheck, FiX as FiXIcon } from "react-icons/fi";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: number;
  stationName: string;
  onSuccess: () => void;
}

export default function ResetPasswordModal({
  isOpen,
  onClose,
  stationId,
  stationName,
  onSuccess,
}: ResetPasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setPasswordValidation({
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecial: /[@$!%*?&#]/.test(value),
    });
  };

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@!%*?&#";
    const allChars = uppercase + lowercase + numbers + special;

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');
    handlePasswordChange(password);
  };

  const handleSubmit = async () => {
    const isPasswordValid = Object.values(passwordValidation).every(Boolean);
    if (!isPasswordValid) {
      setError("Password does not meet the requirements");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/stations/${stationId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        onSuccess();
        handleClose();
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewPassword("");
    setShowPassword(false);
    setError("");
    setPasswordValidation({
      minLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecial: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Reset Password</h2>
            <p className="text-sm text-slate-500 mt-1">For: {stationName}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* New Password Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              New Password
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 pr-10 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              <button
                type="button"
                onClick={generatePassword}
                className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                <FiRefreshCw size={16} />
                Generate
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-slate-700 mb-3">Password must contain:</p>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                {passwordValidation.minLength ? (
                  <FiCheck className="text-green-600" size={16} />
                ) : (
                  <FiXIcon className="text-red-400" size={16} />
                )}
                <span className={passwordValidation.minLength ? "text-green-700" : ""}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center gap-2">
                {passwordValidation.hasUpperCase ? (
                  <FiCheck className="text-green-600" size={16} />
                ) : (
                  <FiXIcon className="text-red-400" size={16} />
                )}
                <span className={passwordValidation.hasUpperCase ? "text-green-700" : ""}>
                  One uppercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                {passwordValidation.hasLowerCase ? (
                  <FiCheck className="text-green-600" size={16} />
                ) : (
                  <FiXIcon className="text-red-400" size={16} />
                )}
                <span className={passwordValidation.hasLowerCase ? "text-green-700" : ""}>
                  One lowercase letter
                </span>
              </li>
              <li className="flex items-center gap-2">
                {passwordValidation.hasNumber ? (
                  <FiCheck className="text-green-600" size={16} />
                ) : (
                  <FiXIcon className="text-red-400" size={16} />
                )}
                <span className={passwordValidation.hasNumber ? "text-green-700" : ""}>
                  One number
                </span>
              </li>
              <li className="flex items-center gap-2">
                {passwordValidation.hasSpecial ? (
                  <FiCheck className="text-green-600" size={16} />
                ) : (
                  <FiXIcon className="text-red-400" size={16} />
                )}
                <span className={passwordValidation.hasSpecial ? "text-green-700" : ""}>
                  One special character (@$!%*?&#)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-200">
          <button
            onClick={handleSubmit}
            disabled={loading || !Object.values(passwordValidation).every(Boolean)}
            className={`flex-1 ${
              loading || !Object.values(passwordValidation).every(Boolean)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
            } text-white font-semibold py-2.5 rounded-lg transition-all`}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
