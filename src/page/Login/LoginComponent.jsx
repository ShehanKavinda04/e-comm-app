import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginInputBox from "../../component/loginInputBox/LoginInputBox";
import { Link } from 'react-router-dom';
import emailValidate from "../../Utils/validate/emailValidate";
import passwordValidate from "../../Utils/validate/passwordValidate";
import { AuthContext } from "../../Contexts/AuthContext";
import toast from "react-hot-toast";

const LoginComponent = ({ onSuccess }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const logHandle = async (e) => {
    e.preventDefault();
    setError("");
    const emailResult = emailValidate(email);
    if (!emailResult.valid) {
      setError(emailResult.errors[0] || "Please enter a valid email address");
      return;
    }
    const passwordResult = passwordValidate(password);
    if (!passwordResult.valid) {
      setError(passwordResult.errors[0] || "Password is too weak or missing");
      return;
    }

    setIsLoading(true);
    try {
      const role = await login(email, password);

      if (role) {
        toast.success("Login Successful!");
      }

      if (onSuccess) {
        onSuccess();
        // Optional: Check if we are on a protected route or simply refresh state
        // For now, closing the modal is sufficient as AuthContext updates global user state.
        if (role === 'SELLER') navigate('/seller/dashboard');
        else if (role === 'ADMIN') navigate('/admin');
      } else {
        // Standalone page behavior
        if (role === 'BUYER') navigate('/');
        else if (role === 'SELLER') navigate('/seller/dashboard');
        else if (role === 'ADMIN') navigate('/admin');
        else navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[550px] p-5 flex flex-col items-center">
      <h2 className="text-3xl text-black font-bold mb-6">Sign In</h2>
      <form onSubmit={logHandle} className="w-full flex flex-col items-center">
        <LoginInputBox
          type="email"
          name="email"
          label="Email Address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          errorMsgBase="email"
        />
        <LoginInputBox
          type="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          errorMsgBase="password"
        />

        <div className="flex justify-between items-center w-full px-2 mt-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="w-4 h-4 bg-white rounded border border-orange-600 focus:ring-orange-500 text-orange-600 cursor-pointer"
            />
            <span className="text-gray-700 text-sm font-medium">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors">Forgot Password?</Link>
        </div>

        <div className="flex flex-col justify-center items-center w-full">
          {error && (
            <p className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-lg w-full mb-4 border border-red-100">
              {error}
            </p>
          )}
          <button
            className={`w-full py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginComponent;