import { useState } from "react";
import passwordValidate from "../../Utils/validate/passwordValidate";
import emailValidate from "../../Utils/validate/emailValidate";
 import userDataValidate from "../../Utils/validate/userDataValidate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LoginInputBox = ({
  type = "text",
  name,
  label,
  placeholder,
  errorMsgBase, // e.g., "email", "password", "cPassword", "username", "phoneNo"
  value = "",
  onChange,
  passwordToMatch = null, // Pass the original password value when errorMsgBase === "cPassword"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  const isPasswordField = type === "password";

  // Determine input type
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  // Validation logic
  const validateField = (val) => {
    if (!touched) return;

    let result = { valid: true, errors: [] };

    if (!val.trim() && errorMsgBase !== "cPassword") {
      setError("This field is required");
      return;
    }

    if (errorMsgBase === "email") {
      result = emailValidate(val);
    } else if (errorMsgBase === "password") {
      result = passwordValidate(val);
    } else if (errorMsgBase === "cPassword") {
      if (!val.trim()) {
        setError("Please confirm your password");
        return;
      }
      if (val !== passwordToMatch) {
        setError("Passwords do not match");
        return;
      }
      setError(""); // Clear if match
      return;
    } else {
      // username, phoneNo, etc.
      result = userDataValidate(val, null, null, null, errorMsgBase);
    }

    setError(result.valid ? "" : (result.errors[0] || "Invalid input"));
  };

  const handleBlur = (e) => {
    setTouched(true);
    validateField(e.target.value);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange?.(e); // Forward to parent

    // Re-validate on change after first blur (live feedback)
    if (touched) {
      validateField(val);
    }
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Auto-complete hints
  const autoCompleteValue =
    type === "password"
      ? name.includes("new") || name.includes("cPassword")
        ? "new-password"
        : "current-password"
      : errorMsgBase === "email"
      ? "email"
      : "off";

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <label className="block px-2 text-sm font-semibold text-gray-800 mb-1">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>

      <div className="relative">
        <input
          className={`w-full px-4 py-3 pr-12 text-gray-700 bg-white border-2 rounded-full outline-none transition-all
            ${error && touched 
              ? "border-red-500 focus:border-red-600" 
              : "border-orange-300 focus:border-orange-500"
            }`}
          type={inputType}
          name={name}
          value={value}
          placeholder={placeholder}
          autoComplete={autoCompleteValue}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-label={label}
          aria-invalid={!!error && touched}
        />

        {/* Password Visibility Toggle */}
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <VisibilityIcon sx={{ fontSize: 22 }} />
            ) : (
              <VisibilityOffIcon sx={{ fontSize: 22 }} />
            )}
          </button>
        )}
      </div>

      {/* Error Message */}
      {touched && error && (
        <p className="mt-2 text-sm text-red-600 px-2 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default LoginInputBox;