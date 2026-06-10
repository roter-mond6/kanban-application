import React, { useState } from "react"; // Add useState here
import { Link } from "react-router-dom"; // Ensure Link is imported for navigation
import { API_BASE_URL } from "../api";
import "./Register.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(""); // Clear any previous errors

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      if (!response.ok) {
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = JSON.parse(text || "{}");
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (err) {
          if (text) errorMessage = text;
        }
        setError(errorMessage || "Registration failed. Please try again.");
        return;
      }

      let data = {};
      try {
        data = JSON.parse(text || "{}");
      } catch (err) {
        console.warn("Registration succeeded but response is not JSON:", text);
      }
      console.log("Registration successful:", data);

      // Redirect to login page after successful registration
      alert("Registration successful! Please log in.");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Register</h1>
        <form onSubmit={handleSubmit} className="register-form">
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

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="register-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
