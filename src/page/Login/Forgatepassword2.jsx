import { useState } from "react";
import api from "../../Services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Forgatepassword2 = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // List of common disposable email domains
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

    if (isDisposableEmail(email)) {
      setError("Temporary email addresses are not allowed");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to your email!");
      navigate("/otp", { state: { email, purpose: "FORGOT_PASSWORD" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Too many requests. Try again later.";
      setError(msg);
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
                  setError("");
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
              {loading ? "Sending..." : "Request OTP"}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            Remember?{" "}
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