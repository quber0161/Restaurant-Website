/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import "./Login.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setShowLogin }) => {
  const { url, setToken, setUserRole } = useContext(StoreContext);
  const navigate = useNavigate(); // 🔹 Initialize useNavigate

  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

// 🟢 Handle login/register submission
const onSubmitHandler = async (event) => {
  event.preventDefault();

  let endpoint = currState === "Login" ? "/api/user/login" : "/api/user/register";
  const response = await axios.post(url + endpoint, data);

  if (response.data.success) {
    const { token, role, userId } = response.data;
    setToken(token);
    setUserRole(role);

    // Store token and role
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", userId); // Or whatever key your backend returns


    setShowLogin(false);

    // 🔹 Redirect based on role
    if (role === "admin") {
      navigate("/admin/orders");
    } else {
      navigate("/");
    }
  } else {
    alert(response.data.message);
  }
};

return (
  <div className="login">
    <form onSubmit={onSubmitHandler} className="login-container">
      <div className="login-title">
        <h2>{currState}</h2>
        <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
      </div>
      <div className="login-inputs">
        {currState === "Login" ? null : (
          <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required />
        )}
        <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email address" required />
        <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required />
      </div>
      <button type="submit">{currState === "Sign Up" ? "Create Account" : "Login"}</button>
      {currState === "Login" ? null : (
        <div className="login-condition">
        <input type="checkbox" required />
        <p>
          By clicking, I agree to the{' '}
          <a href="/privacy" className="terms">
            terms & Privacy policy
          </a>.
        </p>
      </div>)}
      {currState === "Login" ? (
        <p>
          Create a new account? <span onClick={() => setCurrState("Sign Up")}>Sign up here</span>
        </p>
      ) : (
        <p>
          Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
        </p>
      )}
    </form>
  </div>
);
};


export default Login;
