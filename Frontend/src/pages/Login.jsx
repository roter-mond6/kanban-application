import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import "./Login.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Read body as text so we never crash when server returns HTML or empty responses
      const text = await response.text();

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = JSON.parse(text || "{}");
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (err) {
          if (text) errorMessage = text;
        }
        console.error("Login failed:", response.status, text);
        alert(errorMessage);
        return;
      }

      let data = {};
      try {
        data = JSON.parse(text || "{}");
      } catch (err) {
        console.warn("Login succeeded but response is not JSON:", text);
      }
      console.log("Login successful:", data);

      // Save the token to localStorage
      localStorage.setItem("token", data.token);

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error); // Log the error
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">
            <i className="fa-solid fa-bars-progress"></i>
          </span>
        </div>
        <h1 className="login-title">KANBAN APP</h1>
        <h2 className="login-subtitle">Log in to Kanban account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            LOG IN
          </button>
        </form>
        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
