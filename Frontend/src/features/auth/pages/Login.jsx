import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();

  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ username, password });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-center">Login</h1>

        <FormGroup
          value={username}
          onChange={(e) => {
            setusername(e.target.value);
          }}
          placeholder="Enter Username"
        />

        <FormGroup
          value={password}
          onChange={(e) => {
            setpassword(e.target.value);
          }}
          placeholder="Enter Password"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white text-xl py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 cursor-pointer active:scale-95"
        >
          Login
        </button>

        <p className="text-lg">
          Do not have an Account ?{" "}
          <Link className="underline font-bold text-blue-700" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
