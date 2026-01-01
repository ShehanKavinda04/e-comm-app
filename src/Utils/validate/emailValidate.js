import { emailDomain, numberCher, simpleCher, capitalCher } from "./valiDateChar";

/**
 * emailValidate(data, [setErrorMsg], [setError], [setCanSubmit])
 * - Returns { valid: boolean, errors: string[] }
 * - If setter functions are provided they will be called as well.
 */
const emailValidate = (data, setErrorMsg, setError, setCanSubmit) => {
  const errors = [];
  const value = String(data || "").trim();

  if (!value) {
    errors.push("Email is required.");
  } else {
    const parts = value.split("@");
    if (parts.length !== 2) {
      errors.push("Email must contain a single '@' character.");
    } else {
      const [local, domain] = parts;
      if (!local) errors.push("Email username is empty.");
      if (!domain) errors.push("Email domain is empty.");
      // username validation: only allow letters and numbers and some characters
      const validLocalChars = [...simpleCher, ...capitalCher, ...numberCher, ".", "_", "-"];
      for (let ch of local) {
        if (!validLocalChars.includes(ch)) {
          errors.push("Email username contains invalid characters.");
          break;
        }
      }
      // domain validation
      if (!emailDomain.includes(domain)) {
        errors.push("Email domain is not accepted.");
      }
    }
  }

  const result = { valid: errors.length === 0, errors };

  if (typeof setErrorMsg === "function") setErrorMsg(errors);
  if (typeof setError === "function") setError(!result.valid);
  if (typeof setCanSubmit === "function") setCanSubmit(result.valid);

  return result;
};

export default emailValidate;