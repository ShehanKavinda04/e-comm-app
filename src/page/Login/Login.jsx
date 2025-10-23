import { useEffect, useState } from "react";
import userRegister from "../../Utils/auth/register";
import userLogin from "../../Utils/auth/login";
import { Link, useNavigate } from "react-router-dom";
import passwordValidate, {
  conFirmPasswordValidate,
} from "../../Utils/validate/passwordValidate";
import userDataValidate from "../../Utils/validate/userDataValidate";

const Login = () => {
  const [select, setSelect] = useState("login");

  return (
    <div className="flex mt-50 items-center justify-center">
      <div className="w-[90%] shadow-lg p-5 flex flex-col items-center bg-amber-50 justify-center rounded-3xl">
        {select === "login" ? (
          <LoginComponent />
        ) : select === "register" ? (
          <RegisterComponent />
        ) : null}

        {/* change login or register */}
        <div>
          {select === "login" ? (
            <p className="text-black font-semibold">
              Don't have an accouter?
              <span
                className="cursor-pointer"
                onClick={() => setSelect("register")}
              >
                Sing up{" "}
              </span>
            </p>
          ) : select === "register" ? (
            <p className="text-black">
              Already have an accouter
              <span
                className="cursor-pointer"
                onClick={() => setSelect("login")}
              >
                Sing in
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};
export default Login;

{
  /* 
  
  
  
  
  
  
  
  */
}

const LoginComponent = () => {
  const navigate = useNavigate();
  const [CanSubmit, setCanSubmit] = useState(true);
  const [firebaseError, setFirebaseError] = useState({
    email: false,
    password: false,
  });

  const logHandle = (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;

    if (CanSubmit && email.length > 0 && password.length > 0) {
      userLogin(email, password, navigate, setFirebaseError);
    } else {
      console.log("can", CanSubmit);
    }
    console.log({ email, password });
  };

  return (
    <div className="w-[90%] p-5 flex flex-col items-start bg-amber-50 justify-center rounded-3xl">
      <h2 className=" text-3xl text-black px-5 py-2 font-bold mb-6">Sing In</h2>
      <p className=" text-sm text-red-500 px-5  font-bold mb-1 ml-5">
        {firebaseError.email || firebaseError.password}
      </p>
      <form onSubmit={logHandle} className="w-full flex flex-col items-center">
        <LoginInputBox
          inputType="email"
          name="email"
          label="Email:"
          placeholder="Enter Your Email"
          errorMsgBase="email"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <LoginInputBox
          inputType="password"
          name="password"
          label="Password:"
          placeholder="Enter Your Password"
          errorMsgBase="password"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <div className="flex justify-between gap-60 my-4">
          <div>

            <p className="text-black ">Remember Me?</p>
          </div>
          <Link to='/forgatepassword2' className="text-black">Forgot Password?</Link>
        </div>
        <button
          className="text-white w-[55%] mt-5 bg-orange-600 p-[3px] cursor-pointer font-medium"
          type="submit"
        >
          submit
        </button>
      </form>
    </div>
  );
};

{
  /*  
  
  
  
  
  */
}

// eslint-disable-next-line no-unused-vars
const firebaseError = {
  email: false,
  password: false,
};

// eslint-disable-next-line no-unused-vars
const setFirebaseError = (setter = () => {}) => {};

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [CanSubmit, setCanSubmit] = useState(true);

  const registerHandle = (e) => {
    e.preventDefault();

    const name = e.target["username"].value;
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const cPassword = e.target["cPassword"].value;

    if (
      CanSubmit &&
      name.length > 0 &&
      email.length > 0 &&
      password.length > 0 &&
      cPassword.length > 0
    ) {
      userRegister(name, email, password, navigate);
    }
  };
  return (
    <div className="w-[90%] p-5 flex flex-col items-start bg-amber-50 justify-center rounded-3xl">
      <h2 className=" text-3xl text-black px-5 py-2 font-bold mb-6">Sing Up</h2>
      {/* <p className=' text-sm text-red-500 px-5  font-bold mb-1 ml-5'>{firebaseError.email || firebaseError.password}</p> */}
      <form
        onSubmit={registerHandle}
        className="w-full flex flex-col items-center"
      >
        <LoginInputBox
          inputType="text"
          name="username"
          label="Username:"
          placeholder="Enter Your Username"
          errorMsgBase="username"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <LoginInputBox
          inputType="email"
          name="email"
          label="Email:"
          placeholder="Enter Your Email"
          errorMsgBase="email"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <LoginInputBox
          inputType="password"
          name="password"
          label="Password:"
          placeholder="Enter Your Password"
          errorMsgBase="password"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <LoginInputBox
          inputType="password"
          name="cPassword"
          label="Confirm Password:"
          placeholder="Confirm Your Password"
          errorMsgBase="cPassword"
          setCanSubmit={setCanSubmit}
          setFirebaseError={setFirebaseError}
          firebaseError={false}
        />

        <div className="w-[55%] flex justify-center">
          <button
            className="text-white w-full mt-5 bg-orange-600 p-[3px] cursor-pointer font-medium"
            type="submit"
          >
            {" "}
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

const LoginInputBox = ({
  inputType,
  name,
  label,
  placeholder,
  errorMsgBase,
  setCanSubmit,
  setFirebaseError,
  firebaseError,
}) => {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState([]);

  useEffect(() => {
    if (firebaseError.email || firebaseError.password) {
      setError(true);
      setErrorMsg([firebaseError.email || firebaseError.password]);
    }
  }, [firebaseError]);

  return (
    <>
      <div className="w-[90%] my-3 mx-2">
        <label
          className={`px-2 font-semibold ${
            error && "text-red-600"
          } text-black  text-sm bg-amber-50 `}
        >
          {label}
        </label>
        <div
          className={`w-[90%] border-2 rounded-full p-2 my-2 ${
            error ? "border-red-600" : "border-orange-600"
          } `}
        >
          <input
            className={`outline-none w-full text-gray-600 px-3 py-1 ${
              error && "placeholder:text-red-600 text-red-500 "
            }`}
            type={inputType}
            name={name}
            placeholder={placeholder}
            onBlur={(e) =>
              errorMsgBase === "password"
                ? passwordValidate(
                    e.target.value,
                    setErrorMsg,
                    setError,
                    setCanSubmit
                  )
                : // errorMsgBase==='address'
                // ? userDataValidate(
                //   e.target.value,
                //   setErrorMsg,
                //   setError,
                //   setCanSubmit)
                //   : errorMsgBase==='phone'
                //   ? userDataValidate(
                //     e.target.value,
                //     setErrorMsg,
                //     setError,
                //     setCanSubmit,
                //     errorMsgBase)

                errorMsgBase === "username"
                ? userDataValidate(
                    e.target.value,
                    setErrorMsg,
                    setError,
                    setCanSubmit
                  )
                : errorMsgBase === "email"
                ? userDataValidate(
                    e.target.value,
                    setErrorMsg,
                    setError,
                    setCanSubmit,
                    "email"
                  )
                : errorMsgBase === "cPassword"
                ? conFirmPasswordValidate(
                    e.target.value,
                    setErrorMsg,
                    setError,
                    setCanSubmit
                  )
                : null
            }
            onChange={() => {
              if (errorMsgBase !== "false") {
                setFirebaseError((prev) => {
                  const temp = { ...prev, email: false, password: false };
                  return temp;
                });
              }

              if (error) {
                setError(false);
                setCanSubmit(true);
                setErrorMsg([]);
              }
            }}
          />
        </div>
        {error &&
          (errorMsgBase === "password" ? (
            errorMsg.map((error, index) => (
              <p
                className={`text-red-500 font-bold w-[80%] text-sm ${
                  index === 0 && "mt-[-2px]"
                } ml-5`}
                key={index}
              >
                {error}
              </p>
            ))
          ) : (
            <p className="text-red-500 font-bold w-[80%] text-sm ml-5 ">
              {errorMsg?.join(".")}
            </p>
          ))}
      </div>
    </>
  );
};
