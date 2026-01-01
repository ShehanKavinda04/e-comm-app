import { capitalCher, numberCher, simpleCher, symbolCher } from "./valiDateChar";

/**
 * Note: This module keeps the last entered password in module scope
 * so the confirm password validator can compare against it.
 */
let EnteredPassword = "";

const containsAny = (arr, set) => arr.some((c) => set.includes(c));

/**
 * passwordValidate(data, [setErrorMsg], [setError], [setCanSubmit])
 * - Returns { valid: boolean, errors: string[] }
 */
const passwordValidate = (data, setErrorMsg, setError, setCanSubmit) => {
  const value = String(data || "");
  EnteredPassword = value;
  const errors = [];
  const chars = value.split("");

  if (chars.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  } else {
    if (!containsAny(chars, simpleCher)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!containsAny(chars, capitalCher)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!containsAny(chars, numberCher)) {
      errors.push("Password must contain at least one digit.");
    }
    if (!containsAny(chars, symbolCher)) {
      errors.push("Password must contain at least one symbol.");
    }
  }

  const result = { valid: errors.length === 0, errors };

  if (typeof setErrorMsg === "function") setErrorMsg(errors);
  if (typeof setError === "function") setError(!result.valid);
  if (typeof setCanSubmit === "function") setCanSubmit(result.valid);

  return result;
};

export const conFirmPasswordValidate = (data, setErrorMsg, setError, setCanSubmit) => {
  const value = String(data || "");
  const errors = [];

  if (EnteredPassword === "") {
    errors.push("Enter password first before confirming.");
  } else if (EnteredPassword !== value) {
    errors.push("Passwords do not match.");
  }

  const result = { valid: errors.length === 0, errors };

  if (typeof setErrorMsg === "function") setErrorMsg(errors);
  if (typeof setError === "function") setError(!result.valid);
  if (typeof setCanSubmit === "function") setCanSubmit(result.valid);

  return result;
};

export default passwordValidate;