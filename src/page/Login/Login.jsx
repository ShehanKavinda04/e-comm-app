import { useState } from "react";
import LoginComponent from "./LoginComponent";
import RegisterComponent from "./RegisterComponent";


const Login = ({ onSuccess }) => {
  const [select, setSelect] = useState("login");
  return (
    <div className="flex mt-50 items-center justify-center">
      <div className="shadow-lg pb-7 flex flex-col items-center bg-amber-50 justify-center rounded-3xl">
        {select === "login" ? <LoginComponent onSuccess={onSuccess} /> : <RegisterComponent onSuccess={onSuccess} />}
        <div>
          {select === "login" ? (
            <p className="text-black font-semibold">
              Don't have an account?
              <span className="cursor-pointer text-orange-500 hover:underline" onClick={() => setSelect("register")}>
                {" "}Sign up{" "}
              </span>
            </p>
          ) : (
            <p className="text-black">
              Already have an account?
              <span className="cursor-pointer text-orange-500 hover:underline" onClick={() => setSelect("login")}>
                {" "}Sign in
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;