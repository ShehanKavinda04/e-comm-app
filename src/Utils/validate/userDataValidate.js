import { capitalCher, numberCher, simpleCher, symbolCher } from "./valiDateChar";

/**
 * userDataValidate(data, [setErrorMsg], [setError], [setCanSubmit], errorMsgBase)
 * - errorMsgBase: "username" | "email" | "address" | "phone" | undefined
 * - Returns { valid: boolean, errors: string[] }
 *
 * The function is forgiving and returns detailed errors; if setters are provided
 * they are invoked similarly to other validators.
 */
const userDataValidate = (data, setErrorMsg, setError, setCanSubmit, errorMsgBase) => {
  const value = String(data || "");
  const errors = [];
  const chars = value.split("");

  let validCharSet = [...simpleCher, ...capitalCher, " "];

  if (errorMsgBase === "username") {
    validCharSet = [...validCharSet, ...numberCher, "_", ".", "-", ...simpleCher];
  } else if (errorMsgBase === "email") {
    // email local part & domain characters (will be further validated by emailValidate)
    validCharSet = [...validCharSet, ...numberCher, ".", "@", ...symbolCher];
  } else if (errorMsgBase === "phone") {
    validCharSet = [...numberCher, "+", "-", " ", "(", ")"];
  } else if (errorMsgBase === "address") {
    validCharSet = [...validCharSet, ...numberCher, "/", ",", ".", "-", "(", ")"];
  }

  // empty check
  if (!value.trim()) {
    errors.push(`${errorMsgBase || "value"} is required.`);
  } else {
    for (let ch of chars) {
      if (!validCharSet.includes(ch)) {
        errors.push(`${errorMsgBase || "value"} contains invalid character(s).`);
        break;
      }
    }
  }

  const result = { valid: errors.length === 0, errors };

  if (typeof setErrorMsg === "function") setErrorMsg(errors);
  if (typeof setError === "function") setError(!result.valid);
  if (typeof setCanSubmit === "function") setCanSubmit(result.valid);

  return result;
};

export default userDataValidate;