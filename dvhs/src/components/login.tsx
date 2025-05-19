import React, { useState } from "react";
import "../css/login.css";
import { Link } from "react-router-dom";

interface LoginProps {
  onSubmit: (credentials: { email: string; password: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }
    setError("");
    onSubmit({ email, password });
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
    >
      <h2>Log In</h2>

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

      {error && <p className="error">{error}</p>}

      <button
        type="submit"
        className="login-btn"
      >
        Log In
      </button>

      <div className="login-links">
        <Link
          to="/forgot-password"
          className="login-link"
        >
          Forgot password?
        </Link>
        <span className="divider">|</span>
        <Link
          to="/signup"
          className="login-link"
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};
