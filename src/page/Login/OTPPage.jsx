/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
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

  const email = location.state?.email || "example@gmail.com";

  // Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

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
      const response = await axios.post(
        "http://localhost:8080/api/auth/verify-otp",
        { email, otp: otpCode },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("OTP Verified Successfully!");
        navigate("/forgatepassword1", { state: { email } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid or expired OTP";

      if (err.response?.status === 429) {
        setError("Too many attempts. Please try again later.");
      } else if (err.response?.status === 403) {
        setError("OTP expired. Please request a new one.");
        setCanResend(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );
      toast.success("New OTP sent!");
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0].focus();
    } catch (err) {
      toast.error("Failed to resend OTP");
      console.log(err)
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