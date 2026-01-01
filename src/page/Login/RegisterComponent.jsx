import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import LoginInputBox from "../../component/loginInputBox/LoginInputBox";
import emailValidate from "../../Utils/validate/emailValidate";
import passwordValidate, { conFirmPasswordValidate } from "../../Utils/validate/passwordValidate";
import { AuthContext } from "../../Contexts/AuthContext";

const RegisterComponent = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [accountType, setAccountType] = useState("buyer"); // buyer, seller, admin
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const registerHandle = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!userName.trim()) return setServerError("Invalid username");
    const emailResult = emailValidate(email);
    if (!emailResult.valid) return setServerError("Invalid email");
    const passwordResult = passwordValidate(password);
    if (!passwordResult.valid) return setServerError("Password too weak");
    const confirmResult = conFirmPasswordValidate(cPassword, password); // Assume updated to take password arg if needed
    if (!confirmResult.valid) return setServerError("Passwords do not match");
    if (!phoneNo.trim() || phoneNo.length < 10) return setServerError("Invalid phone number");
    if (!["buyer", "seller", "admin"].includes(accountType)) return setServerError("Invalid account type");

    setIsLoading(true);
    const userData = { username: userName, email, password, phoneNo, accountType };
    try {
      const role = await register(userData);
      // Redirect based on role
      if (role === 'BUYER') navigate('/buyer-dashboard');
      else if (role === 'SELLER') navigate('/seller/dashboard');
      else if (role === 'ADMIN') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[470px] mt-[-150px] p-5 flex flex-col items-start bg-amber-50 justify-center rounded-3xl">
      <h2 className="text-3xl text-black px-5 py-2 font-bold mb-6">Sign Up</h2>
      {serverError && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      <form onSubmit={registerHandle} className="w-full flex flex-col items-center">
        <LoginInputBox type="text" name="username" label="Username" placeholder="Enter username" value={userName} onChange={(e) => setUserName(e.target.value)} errorMsgBase="username" />
        <LoginInputBox type="email" name="email" label="Email Address" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} errorMsgBase="email" />
        <LoginInputBox type="password" name="password" label="Password" placeholder="Create strong password" value={password} onChange={(e) => setPassword(e.target.value)} errorMsgBase="password" />
        <LoginInputBox type="password" name="cPassword" label="Confirm Password" placeholder="Re-enter password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} errorMsgBase="cPassword" />
        <LoginInputBox type="tel" name="phoneNo" label="Phone Number" placeholder="07xxxxxxxxx" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} errorMsgBase="phoneNo" />
        <div className="flex flex-col ml-[-173px] gap-2">
          <p className="text-black text-sm font-medium">Account Type: </p>
          <div className="flex flex-col ml-[-50px] gap-2">
            <div className="flex gap-2">
              <input type="radio" name="accountType" value="buyer" checked={accountType === "buyer"} onChange={(e) => setAccountType(e.target.value)} className="w-4 bg-amber-50 text-orange-400 focus:ring-orange-500" />
              <label className="text-black">Buyer</label>
            </div>
            <div className="flex gap-2">
              <input type="radio" name="accountType" value="seller" checked={accountType === "seller"} onChange={(e) => setAccountType(e.target.value)} className="w-4 bg-amber-50 text-orange-400 focus:ring-orange-500" />
              <label className="text-black">Seller</label>
            </div>
            <div className="flex gap-2">
              <input type="radio" name="accountType" value="admin" checked={accountType === "admin"} onChange={(e) => setAccountType(e.target.value)} className="w-4 bg-amber-50 text-orange-400 focus:ring-orange-500" />
              <label className="text-black">Admin</label>
            </div>
          </div>
        </div>
        <div className="w-[55%] flex flex-col justify-center">
          <button
            className={`text-white w-full mt-5 bg-orange-600 p-[8px] font-medium rounded transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-orange-700 cursor-pointer'
              }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterComponent;