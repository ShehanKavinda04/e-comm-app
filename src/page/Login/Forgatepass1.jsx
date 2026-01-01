import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  // Strong password regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validatePassword = (pwd) => {
    if (!pwd) return "Password is required";
    if (pwd.length < 8) return "Password must be at least 8 characters";
    if (!passwordRegex.test(pwd))
      return "Password must contain uppercase, lowercase, number & special character";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!password || !confirmPassword) {
      setError("Both fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/reset-password",
        { email, newPassword: password },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        
        // Auto redirect after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-black mb-8">Reset Password</h1>

        {success ? (
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl font-semibold text-green-600 mb-4">Password Changed!</p>
            <p className="text-gray-600">Your password has been updated successfully.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to login...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-black font-medium text-lg">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter strong password"
                className="w-full px-5 py-4 border-2 border-orange-600 rounded-full focus:outline-none focus:border-orange-700 transition text-black placeholder-gray-500"
                disabled={loading}
              />
            </div>

            <div className="space-y-2 mb-15">
              <label className="text-black font-medium text-lg">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Re-enter password"
                className="w-full px-5 py-4 border-2 border-orange-600 rounded-full focus:outline-none focus:border-orange-700 transition text-black placeholder-gray-500"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password || !confirmPassword}
              className={`w-full py-5 rounded-full font-bold text-white text-lg transition-all ${
                loading || !password || !confirmPassword
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Confirm...
                </span>
              ) : (
                "Set New Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center mt-8 text-gray-600">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-600 font-semibold cursor-pointer hover:underline"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;