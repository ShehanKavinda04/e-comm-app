import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; // Optional: for nice notifications

const Forgatepassword2 = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // List of common disposable email domains (you can expand this)
  const blockedDomains = [
    "10minutemail.com",
    "tempmail.org",
    "guerrillamail.com",
    "mailinator.com",
    "yopmail.com",
    "disposable-mail.com",
    "throwawaymail.com",
    "sharklasers.com",
    "guerrillamailblock.com",
  ];

  const isDisposableEmail = (email) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? blockedDomains.includes(domain) : false;
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Basic validation
    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // 2. Block disposable emails
    if (isDisposableEmail(email)) {
      setError("Temporary email addresses are not allowed");
      setLoading(false);
      return;
    }

    try {
      // 3. Call backend to send OTP
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("OTP sent to your email!");
        // Pass email to OTP page
        navigate("/otp", { state: { email } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Too many requests. Try again later.";
      setError(msg);

      // Specific rate limit message
      if (err.response?.status === 429) {
        setError("Too many attempts. Please wait 15 minutes.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-black text-3xl font-bold text-center">Forgot Password</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-black font-medium text-lg">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); // Clear error on typing
                }}
                placeholder="you@example.com"
                className="border-2 border-orange-600 w-full px-5 py-3 rounded-full focus:outline-none focus:border-orange-700 transition text-black placeholder-gray-500"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full font-semibold text-white text-lg transition-all ${loading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 active:scale-95"
                }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                "Request OTP"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
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
    </div>
  );
};

export default Forgatepassword2;