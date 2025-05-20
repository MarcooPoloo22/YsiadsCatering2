// src/pages/customer/Login.js
import React, { useState, useEffect } from "react";
import "../../styles/customer/Login.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = ({ isLoggedIn, setIsLoggedIn, setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === "success") {
        setIsLoggedIn(true);
        setUser(result.user);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: result.message,
        }).then(() => {
          if (result.user.role === "admin" || result.user.role === "employee") {
            window.location.replace("/admindashboard");
          } else {
            window.location.replace("/");
          }
        });
      } else if (
        result.message ===
        "Your account is not verified. Please check your email to verify your account."
      ) {
        Swal.fire({
          icon: "warning",
          title: "Account Not Verified",
          text: result.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred while logging in.",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-image">
          <img src="./assets/LogPic.JPG" alt="Pic" />
        </div>
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Link to="/forgot-password">Forgot password?</Link>
            <br />
            <button type="submit" className="btn">
              Sign In
            </button>
            <Link to="/create-account">Don’t have an account?</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
