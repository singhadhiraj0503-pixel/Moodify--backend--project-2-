import React, { useState } from "react";
import FormGroup from "../components/FormGroup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const { loading, handleRegister } = useAuth();

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handlesubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-[350px] flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-center">Register</h1>

        <FormGroup
          value={username}
          onChange={(e) => {
            setusername(e.target.value);
          }}
          placeholder="Enter Username"
        />

        <FormGroup
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          placeholder={"Enter Email"}
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
          Already have an Account ?{" "}
          <Link className="underline font-bold text-blue-700" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
