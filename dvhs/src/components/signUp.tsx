import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/login.css";

interface SignUpProps {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- basic validation ---
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirm.trim()
    ) {
      setError("All fields are required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // --- submit data ---
    setError("");
    onSubmit({ firstName, lastName, email, password });
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <h2>Create Account</h2>

      <label>
        First Name
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          placeholder="Jane"
        />
      </label>

      <label>
        Last Name
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          placeholder="Doe"
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />
      </label>

      <label>
        Password
        <div className="pw-wrapper">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
          />
          <button
            type="button"
            className="toggle-pw"
            onClick={() => setShowPw((s) => !s)}
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? "🙈" : "👁️"}
          </button>
        </div>
      </label>

      <label>
        Confirm Password
        <input
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="••••••••"
          minLength={6}
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button
        type="submit"
        className="login-btn"
      >
        Sign Up
      </button>

      <div className="login-links">
        Already have an account?{" "}
        <Link
          to="/login"
          className="login-link"
        >
          Log in
        </Link>
      </div>
    </form>
  );
};
