import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../Services/api";
import { toast } from "react-hot-toast";

const OTPPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  const email = location.state?.email || "";
  const purpose = location.state?.purpose || "FORGOT_PASSWORD"; // REGISTRATION, FORGOT_PASSWORD, 2FA

  // Countdown Timer
  useEffect(() => {
    if (!email) {
      toast.error("Email missing. Returning to login.");
      navigate("/login");
      return;
    }
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer, email, navigate]);

  // Handle OTP Input Change
  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last digit
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      setOtp(pasted.split(""));
      inputsRef.current[5].focus();
    }
  };

  // Verify OTP
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let endpoint = "/auth/verify-email";
      let payload = { email, otp: otpCode };

      if (purpose === "FORGOT_PASSWORD") {
        endpoint = "/auth/reset-password"; // Note: For reset, we actually need the new password too, 
                                          // but usually you validate OTP first or send all together.
                                          // Let's check backend reset-password.
      } else if (purpose === "2FA") {
        endpoint = "/auth/login/2fa";
        payload = { email, otpCode: otpCode }; // Backend expects otpCode for 2fa
      }

      // If it's Forgot Password, we navigate to the actual password reset page FIRST 
      // or we just validate the OTP. Backend reset-password expects OTP + NewPassword.
      // So for Forgot Password, we just pass the OTP to the next page.
      if (purpose === "FORGOT_PASSWORD") {
        // We'll trust the OTP and pass it to the final reset page
        navigate("/forgatepassword1", { state: { email, otp: otpCode } });
        return;
      }

      const response = await api.post(endpoint, payload);

      if (purpose === "REGISTRATION") {
        toast.success("Email Verified! You can now login.");
        navigate("/login");
      } else if (purpose === "2FA") {
        const { accessToken } = response.data;
        localStorage.setItem('token', accessToken);
        // We need to refresh AuthContext here. 
        // Best way is to have AuthContext handle 2FA completion.
        window.location.href = "/"; // Simple reload to refresh context from token
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      let endpoint = "/auth/forgot-password";
      if (purpose === "REGISTRATION") endpoint = "/auth/signup"; // Backend register generates OTP
      
      await api.post(endpoint, { email });
      
      toast.success("New OTP sent!");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      if (inputsRef.current[0]) inputsRef.current[0].focus();
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-lg">
        <h1 className="text-4xl font-bold text-center text-black mb-4">OTP Verification</h1>

        <p className="text-center text-gray-700 mb-1">
          One-time password (OTP) has been sent to
        </p>
        <p className="text-center text-black font-semibold text-lg mb-5">
          {email}
        </p>
        <p className='text-center text-black font-semibold text-lg mb-8'>Enter the OPT below to verify it.</p>

        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : null}
              maxLength={1}
              className="w-14 h-14 text-3xl font-bold text-center text-black border-2 border-black rounded-xl focus:outline-none focus:border-black transition-all"
              disabled={loading}
            />
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
            {error}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all ${loading || otp.join("").length !== 6
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800 active:scale-95"
            }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="text-center mt-6">
          {timer > 0 ? (
            <p className="text-gray-600">
              Resend OTP in <span className="font-bold text-black">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-black font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Didn't receive? Check spam folder or{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-black font-medium cursor-pointer hover:underline"
          >
            Back to Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default OTPPage;